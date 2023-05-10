import {ChatCompletionRequestMessage} from "openai";

export interface IConfig {
  api?: string;
  openai_api_key: string;
  model: string;
  chatTriggerRule: string;
  disableGroupMessage: boolean;
  temperature: number;
  blockWords: string[];
  chatgptBlockWords: string[];
  chatPrivateTriggerKeyword: string;
}
export interface User {
  user_id: string;
  user_name: string;
  wechat_id?: string;
  wechat_name?: string;
  current_model_id?: string;
  email?: string;
  phone?: string;
  gender?: string;
}