// Post a HTTP requests to Slack
export async function postSlackMessage(body: string): Promise<void> {
    const url = 'https://hooks.slack.com/services/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';
    const req = new Request(url, {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: `{"text":"${body}"}`,
    });
  
    try {
      const res = await fetch(req);
      if (res.status !== 200) {
        console.log(`Error in response! Status code: ${res.status}`);
        return;
      }
    } catch (e) {
      console.log(`Fetch Error: ${e}`);
    }
  }