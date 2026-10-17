import {colors, colorText, hideLoader, printFormattedMessage, showLoader} from "../services/utils";
import {mode, openai} from "../app";
import {Modes} from "../enums/modes";

type ChatMessage = { role: "user" | "assistant"; content: string };

const conversationHistory: {
    date: Date,
    message: ChatMessage
}[] = [];
const model: string = "gpt-3.5-turbo";

export async function handleChat(input: string) {
    console.clear();
    console.log(colorText(`Discuss with IA !`, colors.blue));
    conversationHistory.forEach((message: any) => printMessage(message));
    mode.state = Modes.Chat;
}

function printMessage(message: any) {
    const date: Date = message.date;
    const role: string = message.message.role;
    const content: string = message.message.content;
    printFormattedMessage(date, role, content);
}

export async function chat(input: string) {
    if (input.trim() != "") {
        showLoader();
        const userMsg: ChatMessage = {
            role: "user",
            content: input
        }
        const lastMessages: ChatMessage[] = conversationHistory.map((message) => message.message);
        const res = await openai.responses.create({
            model,
            input: [...lastMessages, userMsg]
        });
        const iaResponseMsg: any = {
            date: new Date(),
            message: {role: "assistant", content: res.output_text}
        };
        const userResponseMsg: any = {
            date: new Date(),
            message: userMsg
        }
        conversationHistory.push(userResponseMsg, iaResponseMsg);
        hideLoader();
        printMessage(iaResponseMsg);
    }
}