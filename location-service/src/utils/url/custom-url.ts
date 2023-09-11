export abstract class CustomUrl {
  readonly host: string;
  apiKey: string;
  path: string;
  query: { [key: string]: string }[] = [];

  constructor(hostname: string) {
    this.host = hostname;
  }

  addApiKey(key: string) {
    this.apiKey = key;
    return this;
  }

  addPath(path: string) {
    this.path = path;
    return this;
  }

  addQuery(param: string, value: string) {
    const q = {[param] : value}
    this.query.push(q)
    

    return this;
  }

  url(): string {
    const url = `${this.host}${this.path}?api_key=${this.apiKey}&`;
    let queries: string[] = [];

    this.query.forEach((q) => {
      Object.entries(q).forEach(([key, value]) => {
        queries.push(`${key}=${value}`);
      });
    });

    const queryParams = queries.join('&');

    return `${url}${queryParams}`;
  }
}
