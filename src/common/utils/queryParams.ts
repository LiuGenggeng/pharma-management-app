export function getQueryParams(url: string): Record<string, string | null> {
  const urlObj = new URL(url);
  const params: Record<string, string | null> = {};
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

// 或者获取特定参数
export function getQueryParam(url: string, paramName: string): string | null {
  return new URL(url).searchParams.get(paramName);
}