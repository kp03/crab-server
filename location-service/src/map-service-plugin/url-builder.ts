export enum UrlProtocol {
  HTTP,
  HTTPS,
}

export class CustomUrlBuilder {
  readonly host: string;
  private path: string;
  private protocol: string;
  private query: { [key: string]: string }[] = [];

  /**
   * 
   * @param hostname 
   * @param protocol default is https
   */
  constructor(hostname: string, protocol: UrlProtocol = UrlProtocol.HTTPS) {
    this.host = hostname;
    this.changeProtocol(protocol);
  }

  /**
   * Add or replace path of url
   * @param path path of url
   * @returns 
   */
  addPath(path: string) {
    this.path = path;
    return this;
  }

  /**
   * Add a query to url
   * @param param 
   * @param value 
   * @returns 
   */
  addQuery(param: string, value: string) {
    const q = { [param]: value };
    this.query.push(q);
    return this;
  }

  /**
   * Change protocol of url
   * @param protocol 
   */
  changeProtocol(protocol: UrlProtocol) {
    switch (protocol) {
      case UrlProtocol.HTTP:
        this.protocol = 'http://';
        break;
      case UrlProtocol.HTTPS:
        this.protocol = 'https://';
        break;
      default:
        break;
    }
  }

  /**
   * Change protocol of url explicitly by string
   * @param protocol 
   * @returns 
   */
  changeProtocolString(protocol: string) {
    this.protocol = protocol;
    return this;
  }

  /**
   * Build url from builder
   * @returns 
   */
  getUrl(): string {
    const url = `${this.protocol}${this.host}${this.path}`;
    let queries: string[] = [];

    this.query.forEach((q) => {
      Object.entries(q).forEach(([key, value]) => {
        queries.push(`${key}=${value}`);
      });
    });

    if (queries.length > 0) {
      const queryParams = queries.join('&');
      return `${url}?${queryParams}`;
    }

    return url;
  }
}
