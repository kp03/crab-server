import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { SubscriberService } from 'src/subscriber/subscriber.service';
import { lastValueFrom } from 'rxjs';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';

@Injectable()
export class LocationService {
  private index: string;

  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
    private readonly subscriberService: SubscriberService,
  ) {
    this.index = this.configService.get('ELASTIC_INDEX');
  }

  async checkConnection() {
    const info = await this.esService.info();
    return info;
  }

  async createIndex(): Promise<any> {
    const checkIndex = await this.esService.indices.exists({
      index: this.index,
    });

    if (!checkIndex) {
      const result = this.esService.indices.create({
        index: this.index,
        mappings: {
          properties: {
            coordinates: {
              type: 'geo_point',
            },
            address: {
              type: 'text',
              analyzer: 'my_vi_analyzer',
            },
            fullname: {
              type: 'text',
              analyzer: 'my_vi_analyzer',
            },
            place_id: {
              type: 'keyword',
            },
            phone: {
              type: 'keyword',
            },
            createdAt: {
              type: 'date',
            },
          },
        },
        settings: {
          analysis: {
            analyzer: {
              my_vi_analyzer: {
                type: 'custom',
                tokenizer: 'vi_tokenizer',
                filter: ['lowercase', 'ascii_folding'],
              },
            },
            filter: {
              ascii_folding: {
                type: 'asciifolding',
                preserve_original: true,
              },
            },
          },
        },
      });
      return result;
    } else {
      return {
        message: `index ${this.index} is already existed`,
      };
    }
  }

  async create(createLocationDto: CreateLocationDto) {
    const created = await this.esService.index({
      index: this.index,
      id: createLocationDto.place_id,
      document: createLocationDto,
    });

    return created;
  }

  async findPlaceAndCreate(createCustomerDto: CreateCustomerDto) {
    // -findDetailFromService

    const resultFromES = await this.findByPlaceId(createCustomerDto.address_id);

    //console.log(resultFromES);
    if (resultFromES.hits.hits.length > 0) {
      // console.log(resultFromES.hits.hits[0]);
      const place: any = resultFromES.hits.hits[0]._source;
      //console.log(place);
      const data = {
        place_id: place.place_id,
        address: place.address,
        coordinates: {
          lat: place.coordinates.lat,
          long: place.coordinates.lon,
        },
      };
      //console.log(data);
      return data;
    }

    const placeDetail = await this.findDetailFromService(
      createCustomerDto.address_id,
    );

    console.log(placeDetail)

    const createLocationDto: CreateLocationDto = {
      address: placeDetail.address,
      place_id: placeDetail.place_id,
      phone: createCustomerDto.phone,
      fullname: createCustomerDto.name,
      coordinates: {
        lat: placeDetail.coordinates.lat,
        lon: placeDetail.coordinates.long,
      },
    };

    const created = await this.esService.index({
      index: this.index,
      document: createLocationDto,
    });

    return placeDetail;
  }

  async findAll() {
    const all = await this.esService.search({
      index: this.index,
      query: {
        match_all: {},
      },
    });

    return all;
  }

  async find(address: string) {
    const result = await this.esService.search({
      index: this.index,
      query: {
        match: {
          address: {
            query: address,
          },
        },
      },
    });

    const data = result.hits.hits.map((item) => {
      const detail = item._source;
      return {
        id: detail["place_id"],
        address: detail["address"],
        customer: detail["fullname"],
        phone: detail["phone"],
        latitude: detail["coordinates"]["lat"],
        longitude: detail["coordinates"]["lon"],
      };
    });

    return data;
  }

  async findById(id: string) {
    const result = await this.esService.search({
      index: this.index,
      query: {
        ids: {
          values: [id],
        },
      },
    });

    return result;
  }

  async findByPlaceId(id: string) {
    const result = await this.esService.search({
      index: this.index,
      query: {
        match: {
          place_id: {
            query: id,
          },
        },
      },
    });

    return result;
  }

  async findDetailFromService(placeId: string) {
    const result = await lastValueFrom(
      await this.subscriberService.sendToLocationService('place', placeId),
    );

    //console.log(result);

    return result;
  }

  async findFromService(address: string) {
    const result = await lastValueFrom(
      await this.subscriberService.sendToLocationService('address', address),
    );

    // console.log(result);

    // // -- map results
    const predictions = result.map((place) => ({
      address: place.address,
      id: place.place_id,
    }));

    // -- send to client



    return predictions;
  }

  // -- TEST
  async findAllTest() {
    const all = {
      took: 18,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 1,
          relation: 'eq',
        },
        max_score: 0.3439677,
        hits: [
          {
            _index: 'location',
            _id: 'OnOO94kBBp-V5nbw5cGU',
            _score: 0.3439677,
            _source: {
              address: '227 Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh',
              place_id:
                'LPG0o1ZmSzlgn8_EhhEsJniYYfW1dpqqsDpsp0NnqD24mSj6tU2OqHunAYYe3d0IyeLRbgoZmiq9hiFSGtUtCRWe6W4ODS5lEYqZQ74Z2hhBjnEOGsBCWO2G0S8aGEf0_',
              phone: '258456',
              fullname: 'Hien',
              coordinates: {
                lat: 10.763554524000028,
                lon: 106.68216477300007,
              },
            },
          },
        ],
      },
    };
    return all;
  }

  async findTest(address: string) {
    const resultSaved = [
      {
        _index: 'location',
        _id: 'OnOO94kBBp-V5nbw5cGU',
        _score: 0.3439677,
        _source: {
          address: '227 Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh',
          place_id:
            'LPG0o1ZmSzlgn8_EhhEsJniYYfW1dpqqsDpsp0NnqD24mSj6tU2OqHunAYYe3d0IyeLRbgoZmiq9hiFSGtUtCRWe6W4ODS5lEYqZQ74Z2hhBjnEOGsBCWO2G0S8aGEf0_',
          phone: '258456',
          fullname: 'Hien',
          coordinates: {
            lat: 10.763554524000028,
            lon: 106.68216477300007,
          },
        },
      },
    ];

    return resultSaved;
  }

  async findFromServiceTest(address: string) {
    const result = [
      {
        address: '227 Nguyễn Văn Cừ, Lê Lợi, Bắc Giang, Bắc Giang',
        id:
          'UHK3kGeqa7l3jngUp2SE0WnQeHAud5_kOo9rpEB199--0E4SvHV-6KRWrYDmSAujlfqdgLb5dpeRwWogzd6m5k2kxbAlooYiXu3NBVWWXl_63jVIBoQGHl3ClWiqXAOzX',
      },
      {
        address: '227 Nguyễn Văn Cừ, Ngọc Lâm, Long Biên, Hà Nội',
        id:
          'dUOdXLwWApV86yy2pmS7pGiXUQmjdZmMd9d6V7xqmdBy3UAwvwKWpHGWXDiiAOulcpZcNaJclaZz_TJyprxZ0hjdenxYje-1cfyjV0NllY9wlVADowOFp3LVWCiPVAu65',
      },
      {
        address: '227 Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh',
        id:
          'LPG0o1ZmSzlgn8_EhhEsJniYYfW1dpqqsDpsp0NnqD24mSj6tU2OqHunAYYe3d0IyeLRbgoZmiq9hiFSGtUtCRWe6W4ODS5lEYqZQ74Z2hhBjnEOGsBCWO2G0S8aGEf0_',
      },
      {
        address: '227 Nguyễn Văn Cừ, An Hòa, Ninh Kiều, Cần Thơ',
        id:
          'vBpesn6YoKl52DoxrKqAxk2wQROUr5N-fZJSWZlVjJ5ihUpeon--4EqFMh23bJDjfaxVOrV8JZh1tXuwr1F85kp7c1GGav0HU43gFSpxsnPV5hlkKqgqMnHuuUSGcC-fc',
      },
      {
        address: '227 Nguyễn Văn Cừ, Võ Cường, Bắc Ninh, Bắc Ninh',
        id:
          'Vrl_ekWTe6ZMlagUc1Hg5HG6ml5gfJvhVrmbKk5yn9ki37J6MXSLxiDdsFp0smr6eqiqG3uL6FWtuHlfbFG3m9OysSNNdKvff7ubWV5rm_J-gNa0NVg2Lm3ypmyZWDODb',
      },
    ];

    return result;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const script = Object.entries(updateLocationDto).reduce(
      (result, [key, value]) => {
        return `${result} ctx._source.${key}='${value}';`;
      },
      '',
    );

    const updated = await this.esService.updateByQuery({
      index: this.index,
      query: {
        ids: {
          values: [id],
        },
      },
      script: script,
    });

    return updated;
  }

  async remove(id: string) {
    this.esService.deleteByQuery({
      index: this.index,
      query: {
        ids: {
          values: [id],
        },
      },
    });
  }

  async removeAll() {
    const deletedAll = await this.esService.indices.delete({
      index: this.index,
    });
    return deletedAll;
  }
}
