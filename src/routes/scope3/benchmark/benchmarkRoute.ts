import { ModuleKey } from "../../../constant/moduleConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";
import { createRoute } from "../../../utils";

const BenchmarkRouteConstant = [
  createRoute("post", "/graph-benchmark-distance", BenchmarkController, "getDistanceWeightBand", ModuleKey.Benchmarks,  { type: 'mile' }),
  createRoute("post", "/graph-benchmark-weight", BenchmarkController, "getDistanceWeightBand", ModuleKey.Benchmarks,  { type: 'weight' }),
  createRoute("post", "/emission-trend-graph", BenchmarkController, "emissionTrendGraph", ModuleKey.Benchmarks, {type: "region"}),
  createRoute("post", "/emission-trend-graph-lane", BenchmarkController, "emissionTrendGraph", ModuleKey.Benchmarks, {type: "lane"}),
  createRoute("post", "/intermodel-trend-graph", BenchmarkController, "intermodelTrendGraph", ModuleKey.Benchmarks, {type: "region"}),
  createRoute("post", "/intermodel-trend-graph-lane", BenchmarkController, "intermodelTrendGraph", ModuleKey.Benchmarks, {type: "lane"}),
  createRoute("post", "/emission-by-region", BenchmarkController, "emissionByRegion", ModuleKey.Benchmarks, {type: "region"}),
  createRoute("post", "/emission-by-lane", BenchmarkController, "emissionByRegion", ModuleKey.Benchmarks, {type: "lane"}),
  createRoute("post", "/company-emission", BenchmarkController, "benchmarkCompanyEmission", ModuleKey.Benchmarks),
  createRoute("post", "/company-emission-graph", BenchmarkController, "companyEmissionGraph", ModuleKey.Benchmarks),
  createRoute("post", "/emission-in-lane", BenchmarkController, "emissionInLane", ModuleKey.Benchmarks),
  createRoute("post", "/lane-search", BenchmarkController, "laneSearch", ModuleKey.Benchmarks),
  createRoute("post", "/map-benchmark-region", BenchmarkController, "getRegionBenchmarks", ModuleKey.Benchmarks),
  createRoute("post", "/company-band-name", BenchmarkController, "getBandsName", ModuleKey.Benchmarks),
  createRoute("post", "/map-benchmark-company", BenchmarkController, "companyBenchmark", ModuleKey.Benchmarks),
  createRoute("post", "/carrier-emission-table", BenchmarkController, "carrierEmissionTable", ModuleKey.Benchmarks),
  createRoute("get", "/graph-benchmark-region", BenchmarkController, "benchmarkRegion", ModuleKey.Benchmarks),
];

export default BenchmarkRouteConstant;
