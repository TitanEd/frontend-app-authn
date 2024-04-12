import { getConfig } from '@edx/frontend-platform';
import { useQuery } from 'react-query';

const useSiteConfig = () => {
  const fetchConfig = async () => {
    const baseURL = getConfig().LMS_BASE_URL;
    const instanceConfigAPIUrl = getConfig().AC_INSTANCE_CONFIG_API_URL;

    if (!baseURL || !instanceConfigAPIUrl) {
      return;  // Early return if URLs are not configured properly
    }

    const response = await fetch(`${baseURL}${instanceConfigAPIUrl}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result;
  };

  const { data, isLoading, isError } = useQuery(
    'siteConfig',  // Use a single query key for the config data
    fetchConfig,
    {
      enabled: !!getConfig().LMS_BASE_URL && !!getConfig().AC_INSTANCE_CONFIG_API_URL,
      staleTime: 5 * 60 * 1000, // Optionally add staleTime if data does not change often
      cacheTime: 60 * 60 * 1000, // Optionally add cacheTime
    },
  );

  return {
    headerLogo: data?.logo,
    siteName: data?.platform_name,
    favicon: data?.favicon,  // You can also access other config data like favicon
    loading: isLoading,
    isError,
  };
};

export default useSiteConfig;
