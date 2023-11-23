import z from 'zod';

const BBox2DModel = z.tuple([z.number(), z.number(), z.number(), z.number()]);
const BBox3DModel = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

export const BBoxModel = BBox2DModel.or(BBox3DModel);
export type BBox = z.infer<typeof BBoxModel>;

const Position2DModel = z.tuple([z.number(), z.number()]);
const Position3DModel = z.tuple([z.number(), z.number(), z.number()]);

export const PositionModel = Position2DModel.or(Position3DModel);
export type Position = z.infer<typeof PositionModel>;

export const PointModel = z.object({
  type: z.literal('Point'),
  coordinates: PositionModel,
});
export type Point = z.infer<typeof PointModel>;

export const MultiPointModel = z.object({
  type: z.literal('MultiPoint'),
  coordinates: z.array(PositionModel),
});
export type MultiPoint = z.infer<typeof MultiPointModel>;

export const LineStringModel = z.object({
  type: z.literal('LineString'),
  coordinates: z.array(PositionModel),
});
export type LineString = z.infer<typeof LineStringModel>;

export const MultiLineStringModel = z.object({
  type: z.literal('MultiLineString'),
  coordinates: z.array(z.array(PositionModel)),
});
export type MultiLineString = z.infer<typeof MultiLineStringModel>;

export const PolygonModel = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(PositionModel)),
});
export type Polygon = z.infer<typeof PolygonModel>;

export const MultiPolygonModel = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(z.array(z.array(PositionModel))),
});
export type MultiPolygon = z.infer<typeof MultiPolygonModel>;

export const GeometryModel = z.discriminatedUnion('type', [
  PointModel,
  MultiPointModel,
  LineStringModel,
  MultiLineStringModel,
  PolygonModel,
  MultiPolygonModel,
]);
export type Geometry = z.infer<typeof GeometryModel>;

export const GeometryCollectionModel = z.object({
  type: z.literal('GeometryCollection'),
  geometries: z.array(GeometryModel),
});
export type GeometryCollection = z.infer<typeof GeometryCollectionModel>;

export const PropertiesModel = z.record(z.string(), z.any()).or(z.null());
export type Properties = z.infer<typeof PropertiesModel>;

export const FeatureModel = z.object({
  type: z.literal('Feature'),
  geometry: GeometryModel,
  id: z.string().optional().or(z.number().optional()),
  properties: PropertiesModel,
});
export type Feature = z.infer<typeof FeatureModel>;

export const FeatureCollectionModel = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(FeatureModel),
});
export type FeatureCollection = z.infer<typeof FeatureCollectionModel>;
