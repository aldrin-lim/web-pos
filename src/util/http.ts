import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

export const attachToken = async (getTokenSilently: () => Promise<string>) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      const token = await getTokenSilently()
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // TODO: This is a hack since axios doesn't support async interceptors
      setTimeout(() => {
        resolve(true)
      }, 100)
    } catch (e) {
      console.error('Failed to retrieve token', e)
      reject(e)
    }
  })

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized responses, maybe initiate a user sign-out or redirect to a login page.
    }
    // Optionally handle other error statuses or log errors.

    return Promise.reject(error)
  },
)

export const httpClient = axiosInstance
