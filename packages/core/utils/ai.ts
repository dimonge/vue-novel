import axios from 'axios'

async function fetchCompletion(prompt) {
  try {
    const apiKey = process.env.VUE_APP_OPEN_API_KEY
    console.log('apiKey', apiKey)
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        prompt,
        model: 'text-davinci-003',
        max_tokens: 50, // Number of tokens (words/characters) you want to generate
        temperature: 0
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.choices[0]?.text.trim()
  } catch (error) {
    console.error('Error fetching completion:', error)
    return ''
  }
}
export { fetchCompletion }
