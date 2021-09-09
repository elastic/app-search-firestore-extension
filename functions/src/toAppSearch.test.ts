import { toAppSearch } from "./toAppSearch";

describe("toAppSearch", () => {
  let originalValue: string | undefined;

  beforeAll(() => {
    originalValue = process.env.APP_SEARCH_ENGINE_NAME;
  });

  afterAll(() => {
    process.env.APP_SEARCH_ENGINE_NAME = originalValue;
  });

  beforeEach(() => {
    process.env.INDEXED_FIELDS = "foo,bar";
  });

  it('should only use fields from documents that have been marked as "indexed"', () => {
    // So it should only add foo and bar to the indexed object because that's all we have specified here
    process.env.INDEXED_FIELDS = "foo,bar";

    expect(
      toAppSearch({
        foo: "foo",
        bar: "bar",
        baz: "baz",
      })
    ).toEqual({
      foo: "foo",
      bar: "bar",
    });
  });
});
