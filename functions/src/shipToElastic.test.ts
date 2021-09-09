import { handler } from "./shipToElastic";

describe("shipToElastic", () => {
  let originalValue: string | undefined;

  beforeAll(() => {
    originalValue = process.env.APP_SEARCH_ENGINE_NAME;
    process.env.APP_SEARCH_ENGINE_NAME = "test_engine";
  });

  afterAll(() => {
    process.env.APP_SEARCH_ENGINE_NAME = originalValue;
  });

  const client = {
    indexDocuments: jest.fn(),
    destroyDocuments: jest.fn(),
  };

  const shipToElastic = handler(client);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("if a document is created, it should index it to app search", async () => {
    const change = {
      before: { exists: false },
      after: {
        id: "1",
        exists: true,
        data: () => {
          return {
            foo: "foo",
            bar: "bar",
          };
        },
      },
    } as any;

    await shipToElastic(change);

    expect(client.indexDocuments).toHaveBeenCalledWith("test_engine", [
      { id: "1", foo: "foo", bar: "bar" },
    ]);
  });

  it("if a document is updated, it should index it to app search", async () => {
    const change = {
      before: {
        id: "1",
        exists: true,
        data: () => {
          return {
            foo: "foo",
          };
        },
      },
      after: {
        id: "1",
        exists: true,
        data: () => {
          return {
            foo: "foo",
            bar: "bar",
          };
        },
      },
    } as any;

    await shipToElastic(change);

    expect(client.indexDocuments).toHaveBeenCalledWith("test_engine", [
      { id: "1", foo: "foo", bar: "bar" },
    ]);
  });

  it("if a document is deleted, it should deleted it from", async () => {
    const change = {
      before: {
        id: "1",
        exists: true,
        data: () => {
          return {
            foo: "foo",
            bar: "bar",
          };
        },
      },
      after: {
        exists: false,
      },
    } as any;

    await shipToElastic(change);

    expect(client.destroyDocuments).toHaveBeenCalledWith("test_engine", ["1"]);
  });
});
