

function execute() {
  const propListSel = '#app > div > buyer-location > div > div > div > div.styles-singlePageWrapper-E2tBI > div > div.index-map-tUPTm > div > div > div.side-block-root-S2Oo9 > div > div.styles-root-CJb8Z > div > div > div';

  const parentDiv = document.querySelector(propListSel);
  if (parentDiv) {
    console.log('Parent div:', parentDiv);

    // loop though all children of parent div and console log them
    const children = parentDiv.children;
    console.log('Children:', children);
    for (let i = 0; i < children.length; i++) {
      const meta = children[i].querySelector('div > div > meta');
      const description = meta.getAttribute('content');
      console.log('Description 9:', description);

      run(description).then(res => {
        console.log('11', res, description);

        switch (res.males) {
          case 'true':
            addMark(children[i], '✅');
            break;
          case 'false':
            addMark(children[i], '❌');
            break;
          case 'unknown':
            addMark(children[i], '🤷🏻‍♂️');
            break;
        }

      }).catch(error => {
        console.error('Error:', error);
      });
    }

    function addMark(listing, mark) {
      const markElement = document.createElement('span');
      markElement.style.fontSize = '25px';
      markElement.innerText = mark;
      listing.appendChild(markElement);
    }


    function run(description) {
      console.log('making openai request');
      return fetch("https://api.openai.com/v1/chat/completions", {
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
                  text: `${description}`
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
      })
        .then(response => {
          console.log('response', response);
          return response.json();
        })
        .then(data => {
          console.log('data', data);
          const result = JSON.parse(data.choices[0].message.content);
          console.log('result', result);
          return result;
        });
    }
  } else {
    console.log('Parent div not found');
  }
}

execute();
