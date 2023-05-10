import { MongoClient, Db } from 'mongodb';
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";
import { User } from "./interface";
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
// Replace the following with your MongoDB Atlas connection string
const uri: string = process.env.MONGO_URI || '';
const dbName: string = process.env.DB_NAME || '';

class DB {
  private static client = new MongoClient(uri);
  private static db: Db;

  private static async connect() {
    await DB.client.connect();
    DB.db = DB.client.db(dbName);
  }

  /**
   * 添加一个用户, 如果用户已存在则返回已存在的用户
   * @param username
   */

  public async addUser(username: string): Promise<User> {
    await DB.connect();
    const usersCollection = DB.db.collection('userprofiles');
    const newUser: User = {
      user_name: username,
      // Generate a UUID for the user_id
      user_id: uuidv4(),
      // By default, using the first model
      current_model_id: '0',
    };

    const result = await usersCollection.insertOne(newUser);
    // Find the inserted document using the insertedId property
    const insertedUser = await usersCollection.findOne({ _id: result.insertedId });

    return insertedUser as unknown as User;
  }

  /**
   * 根据用户名获取用户, 如果用户不存在则添加用户
   * @param username
   */
  public async getUserByUsername(username: string): Promise<User> {
    await DB.connect();

    const usersCollection = DB.db.collection('userprofiles');
    let existUser = await usersCollection.findOne({ user_name: username });
    if (existUser) {
      console.log(`用户${username}已存在`);
      return existUser as unknown as User;
    }

    return this.addUser(username);
  }

  /**
   * 根据用户id, 模型id获取对话
   * @param user_id
   * @param model_id
   * @return {string}
   */

  public async getConversationId(user_id: string, model_id: string): Promise<string> {
    await DB.connect();

    const convColletions = DB.db.collection('conversations');
    let conv = await convColletions.findOne({ user_id: user_id, model_id: model_id });
    if (conv) {
      return conv.conv_id;
    }
    return "";
  }

  /**
   * 获取用户的聊天记录
   * @param username
   */
  public getChatMessage(username: string): Array<ChatCompletionRequestMessage> {
    return [];
  }

  /**
   * 设置用户的prompt
   * @param username
   * @param prompt
   */
  public setPrompt(username: string, prompt: string): void {
    return;
  }

  /**
   * 添加用户输入的消息
   * @param username
   * @param message
   */
  public addUserMessage(username: string, message: string): void {
    return;
  }

  /**
   * 添加ChatGPT的回复
   * @param username
   * @param message
   */
  public addAssistantMessage(username: string, message: string): void {
    return;
  }

  /**
   * 根据用户名获取用户的id
   * @param username
   * @return {string}
   */
  public async getUserId(username: string): Promise<string> {
    const user = await this.getUserByUsername(username);
    if (user) {
      return user.user_id;
    }
    return "";
  }



  public async getModelId(username: string): Promise<string> {
    const user = await this.getUserByUsername(username);
    if (user) {
      return user.current_model_id || '';
    }
    return "";
  }

  /**
   * 清空用户的聊天记录, 并将prompt设置为默认值
   * @param username
   */
  public clearHistory(username: string): void {
    return;
  }

  public getAllData(): User[] {
    return [];
  }
}
const DBUtils = new DB();
export default DBUtils;