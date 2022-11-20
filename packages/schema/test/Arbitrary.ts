import * as Arb from "@fp-ts/codec/Arbitrary"
import * as set from "@fp-ts/codec/data/Set"
import * as G from "@fp-ts/codec/Guard"
import * as S from "@fp-ts/codec/Schema"
import { pipe } from "@fp-ts/data/Function"
import * as fc from "fast-check"

const unsafeGuardFor = G.provideUnsafeGuardFor(set.Provider)
const unsafeArbitraryFor = Arb.provideUnsafeArbitraryFor(set.Provider)

describe("Arbitrary", () => {
  const sampleSize = 100

  it("minLength", () => {
    const arbitrary = pipe(Arb.string, Arb.minLength(1))
    const guard = unsafeGuardFor(arbitrary)
    expect(fc.sample(arbitrary.arbitrary(fc), sampleSize).every(guard.is)).toEqual(true)
  })

  it("maxLength", () => {
    const arbitrary = pipe(Arb.string, Arb.maxLength(2))
    const guard = unsafeGuardFor(arbitrary)
    expect(fc.sample(arbitrary.arbitrary(fc), sampleSize).every(guard.is)).toEqual(true)
  })

  describe("unsafeArbitraryFor", () => {
    it("declaration", () => {
      const schema = set.schema(S.string)
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it.skip("lazy", () => {
      interface A {
        readonly a: string
        readonly as: Set<A>
      }
      const A: S.Schema<A> = S.lazy<A>(() =>
        S.struct({
          a: S.string,
          as: set.schema(A)
        })
      )
      const schema = set.schema(A)
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("string", () => {
      const schema = S.string
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("number", () => {
      const schema = S.number
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("boolean", () => {
      const schema = S.boolean
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("of", () => {
      const schema = S.of(1)
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("tuple", () => {
      const schema = S.tuple(S.string, S.number)
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("union", () => {
      const schema = S.union(S.string, S.number)
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("struct", () => {
      const schema = S.struct({ a: S.string, b: S.number })
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      fc.assert(fc.property(arbitrary, (a) => guard.is(a)))
    })

    it("indexSignature", () => {
      const schema = S.indexSignature(S.string)
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("array", () => {
      const schema = S.array(S.string)
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("minLength", () => {
      const schema = pipe(S.string, S.minLength(1))
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("maxLength", () => {
      const schema = pipe(S.string, S.maxLength(2))
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("minimum", () => {
      const schema = pipe(S.number, S.minimum(1))
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })

    it("maximum", () => {
      const schema = pipe(S.number, S.maximum(1))
      const arbitrary = unsafeArbitraryFor(schema).arbitrary(fc)
      const guard = unsafeGuardFor(schema)
      expect(fc.sample(arbitrary, sampleSize).every(guard.is)).toEqual(true)
    })
  })
})
