import { handler } from "./shipToElastic";

describe("shipToElastic", () => {
  let originalValue: string | undefined;

  beforeAll(() => {
    originalValue = process.env.APP_SEARCH_ENGINE_NAME;
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
    process.env.APP_SEARCH_ENGINE_NAME = "test_engine";
    process.env.INDEXED_FIELDS = "foo,bar";
  });

  const getDocCreated = (id: string, data: object) => {
    return {
      before: { exists: false },
      after: {
        id,
        exists: true,
        data: () => data,
      },
    };
  };

  const getDocUpdated = (id: string, before: object, after: object) => {
    return {
      before: {
        id,
        exists: true,
        data: () => before,
      },
      after: {
        id,
        exists: true,
        data: () => after,
      },
    };
  };

  const getDocDeleted = (id: string, data: object) => {
    return {
      before: {
        id,
        exists: true,
        data: () => data,
      },
      after: {
        exists: false,
      },
    };
  };

  it("if a document is created, it should index it to app search", async () => {
    const change = getDocCreated("1", {
      foo: "foo",
      bar: "bar",
    }) as any;

    await shipToElastic(change);

    expect(client.indexDocuments).toHaveBeenCalledWith("test_engine", [
      { id: "1", foo: "foo", bar: "bar" },
    ]);
  });

  it("if a document is updated, it should index it to app search", async () => {
    const change = getDocUpdated(
      "1",
      {
        foo: "foo",
      },
      {
        foo: "foo",
        bar: "bar",
      }
    ) as any;

    await shipToElastic(change);

    expect(client.indexDocuments).toHaveBeenCalledWith("test_engine", [
      { id: "1", foo: "foo", bar: "bar" },
    ]);
  });

  it("if a document is updated but fields from INDEXED_FIELDS have not changed, it should not index it to app search", async () => {
    const change = getDocUpdated(
      "1",
      {
        notFoo: "foo",
      },
      {
        notFoo: "foo",
        notBar: "bar",
      }
    ) as any;

    const result = await shipToElastic(change);

    expect(client.indexDocuments).not.toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  it("if a document is deleted, it should delete it from app search", async () => {
    const change = getDocDeleted("1", {
      foo: "foo",
      bar: "bar",
    }) as any;

    await shipToElastic(change);

    expect(client.destroyDocuments).toHaveBeenCalledWith("test_engine", ["1"]);
  });

  describe("when indexing documents in app search", () => {
    it("will only index the specified fields", async () => {
      // So it should only add foo and bar to the indexed object because that's all we have specified here
      process.env.INDEXED_FIELDS = "foo,bar";

      const change = getDocCreated("1", {
        foo: "foo",
        bar: "bar",
        baz: "baz",
      }) as any;

      await shipToElastic(change);

      expect(client.indexDocuments).toHaveBeenCalledWith("test_engine", [
        { id: "1", foo: "foo", bar: "bar" },
      ]);
    });
  });
});
