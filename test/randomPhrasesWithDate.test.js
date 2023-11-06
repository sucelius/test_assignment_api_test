import request from "supertest";

const baseUrl = "http://numbersapi.com/";

describe("Эндпоинт с фактами", () => {
  it("должен вернуть 200 статус код", async () => {
    const response = await request(baseUrl).get("random/year/");
    expect(response.statusCode).toBe(200);
  });
});

describe("Случайный факт с датой", () => {
  const facts = [];
  const totalRequests = 100;
  const regex =
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2}(st|nd|rd|th)\b/g;

  //Нужно увеличить время на запросы (по дефолту 5000 мс)
  const requestTimeOut = 120000;

  //Подгатовка данных на основе требований
  beforeAll(async () => {
    let counter = 0;
    const listOfDataFromServer = [];
    while (counter < totalRequests) {
      const { text } = await request(baseUrl).get("random/year/");
      if (text.match(regex)) {
        listOfDataFromServer.push(text);
      }

      counter += 1;
    }
    facts.push(...listOfDataFromServer);
  }, requestTimeOut);

  afterAll(() => {
    facts.splice(0, facts.length);
  });

  it(`${facts} не должен  быть  пустой`, () => {
    expect(facts).not.toHaveLength(0);
  });

  it(`${facts} должен быть пустой (тест упадёт)`, () => {
    expect(facts).toHaveLength(0);
  });

  it("факт соответсует регулярке", () => {
    facts.forEach((fact) => expect(fact).toMatch(regex));
  });

  it("длинна факта больше 10", () => {
    facts.forEach((fact) => expect(fact.length >= 10).toBe(true));
  });
});
