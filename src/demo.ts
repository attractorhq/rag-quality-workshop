import {
  loadDocuments,
  loadEvaluationCases,
  loadRecordedAnswers,
} from "./fixtures.js";
import { GroundedRecordedGenerator } from "../solutions/generator.js";
import { runPipeline } from "../solutions/pipeline.js";
import { AccessControlledRetriever } from "../solutions/retriever.js";

const [documents, cases, recordedAnswers] = await Promise.all([
  loadDocuments(),
  loadEvaluationCases(),
  loadRecordedAnswers(),
]);
const selected = cases.find((candidate) => candidate.query.id === "returns");
if (selected === undefined) {
  throw new Error("The returns workshop case is missing.");
}
const result = await runPipeline(
  selected.query,
  documents,
  new AccessControlledRetriever(),
  new GroundedRecordedGenerator(recordedAnswers),
);

console.log(
  JSON.stringify(
    {
      query: selected.query.text,
      answer: result.answer,
      trace: result.trace,
    },
    null,
    2,
  ),
);
