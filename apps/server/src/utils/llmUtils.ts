import { MODEL_SOURCE } from "shared/enums/models";
import { Anthropic, HuggingFace } from "@llm-tools/embedjs";

export function getModelForRag(model_source: MODEL_SOURCE, model_key: string | number) {
  switch (model_source) {
    case MODEL_SOURCE.Anthropic:
      return new Anthropic({ modelName: model_key as string });
    case MODEL_SOURCE.OpenAI:
      return model_key as number;
      break;
    case MODEL_SOURCE.Mistral:
      return new HuggingFace({ modelName: model_key as string });
    default:
      throw new Error("Model not recognized");
  }
}
