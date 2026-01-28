import { HfInference } from "@huggingface/inference";

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || "";
const hf = new HfInference(HF_TOKEN);

export const generateAIResponse = async (userMessage: string, history: any[] = []) => {
  try {
    const response = await hf.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        {
          role: "system",
          // [수정 포인트] 특정 은행 언급을 삭제하고 일반적인 금융 서비스 비서로 설정
          content: "당신은 친절하고 전문적인 AI 금융 비서 'Smart Star'입니다. 사용자가 인사말(예: 안녕, 안녕하세요 등)을 하면, 반갑게 맞이하고 자연스러운 대화를 나누세요. 단, 추천 서비스(맞춤형 금융 상품 추천, 환율 정보, 지출 분석 등)를 제안할 때는 본문에 텍스트로 나열하지 말고, 답변의 맨 마지막 줄에 '[[SUGGESTIONS]]' 태그와 함께 쉼표로 구분하여 적어주세요. 예시: '반갑습니다! 무엇을 도와드릴까요?\n[[SUGGESTIONS]] 맞춤형 금융 상품 추천, 환율 정보, 지출 분석'. 답변 시 특정 기관명(KB 등)은 언급하지 마세요."
        },
        ...history.map(msg => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: typeof msg.parts === 'string' ? msg.parts : msg.parts[0]?.text || ""
        })),
        { role: "user", content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const result = response.choices[0].message.content;

    if (!result) throw new Error("Empty response");
    return result;

  } catch (error: any) {
    console.error("Hugging Face API 에러:", error);
    if (error.message?.includes("loading")) {
      return "비서가 정보를 준비 중입니다. 잠시 후 다시 질문해 주세요!";
    }
    return "연결 상태가 불안정합니다. 잠시 후 다시 말씀해 주세요.";
  }
};