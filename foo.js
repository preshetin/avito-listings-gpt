
async function run() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              text: "Analyze the rental property description to determine if male tenants are accepted. Respond only with a JSON object indicating whether males are allowed.\n\n# Steps\n\n1. **Translation** (optional): If the description is in a different language, translate it to English for better understanding.\n2. **Text Analysis**: Look for keywords or phrases in the description that specifically mention gender preferences or restrictions regarding tenants.\n3. **Determine Gender Preference**: Based on the analysis, conclude if male tenants are allowed, not allowed, or if it is unknown from the description provided.\n4. **Categorize Response**: Convert the conclusion into the JSON format as specified.\n\n# Output Format\n\nRespond only with a JSON object in this format:\n```json\n{\"males_allowed\": true/false/\"unknown\"}\n```\n\n# Example\n\n- **Description**: \"сдам комнату в двухкомнатной квартире аккуратной некурящей девушке без вредных привычек.\"\n- **Analysis**: The description specifies a preference for a \"neat, non-smoking girl.\"\n- **Conclusion**: Males are not allowed.\n- **Output**: `{\"males_allowed\": false}`\n\n# Notes\n\n- If the description explicitly states a preference for females or excludes males, classify it as `false`.\n- If the description does not mention gender preferences, classify it as `\"unknown\"`.\n- Consider cultural or contextual hints that might imply gender preferences.",
              type: "text"
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Внимание!\nПожалуйста читайте.\n\nОдному взрослому (от 25 лет) славянину Мужчине!, хорошо думающему и говорящему По-Русски! Строго.\n\nТаунхаус!\nЦокольный тёплый этаж (-1) с окном, сдам на пару месяцев. Длительный срок обсуждается на месте.\nВсё необходимое в ко"
            }
          ]
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "gender_status",
          schema: {
            type: "object",
            required: ["males"],
            properties: {
              males: {
                enum: ["true", "false", "unknown"],
                type: "string",
                description: "Indicates the male status with possible values: true, false, or 'unknown'."
              }
            },
            additionalProperties: false
          },
          strict: true
        }
      },
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error: ${data.error.message}`);
  }

  const result = JSON.parse(data.choices[0].message.content);

  console.log(result);
}

run()

