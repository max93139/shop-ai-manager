import { NovaPoshtaSettlement, NovaPoshtaWarehouse } from '@shop-ai/types';

const API_URL = 'https://api.novaposhta.ua/v2.0/json/';

async function callNp<T = any>(modelName: string, calledMethod: string, methodProperties: Record<string, any>): Promise<T[]> {
  // Read at call time: this module is imported before index.ts runs dotenv.config().
  const apiKey = process.env.NOVA_POSHTA_API_KEY;
  if (!apiKey) {
    console.error('NOVA_POSHTA_API_KEY is not configured');
    return [];
  }
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        modelName,
        calledMethod,
        methodProperties,
      }),
    });

    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return [];
    return json.data;
  } catch (err) {
    console.error(`Nova Poshta error in ${modelName}.${calledMethod}:`, err);
    return [];
  }
}

export async function searchNpSettlements(cityName: string, limit = 5): Promise<NovaPoshtaSettlement[]> {
  const data = await callNp('Address', 'searchSettlements', {
    CityName: cityName.trim(),
    Limit: String(limit),
    Page: '1',
  });

  if (!data.length || !data[0].Addresses) return [];

  return data[0].Addresses.map((addr: any) => ({
    ref: addr.Ref,
    present: addr.Present,
    mainDescription: addr.MainDescription,
    area: addr.Area,
    region: addr.Region || '',
    deliveryCityRef: addr.DeliveryCity,
  }));
}

export async function getNpWarehouses(cityRefOrName: string, searchOrNumber?: string, limit = 10): Promise<NovaPoshtaWarehouse[]> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cityRefOrName.trim());
  const methodProperties: Record<string, any> = {
    Limit: String(limit),
    Page: '1',
  };

  if (isUuid) {
    methodProperties.CityRef = cityRefOrName.trim();
  } else {
    methodProperties.CityName = cityRefOrName.trim();
  }

  if (searchOrNumber?.trim()) {
    methodProperties.FindByString = searchOrNumber.trim();
  }

  const data = await callNp('AddressGeneral', 'getWarehouses', methodProperties);

  return data.map((wh: any) => ({
    ref: wh.Ref,
    siteKey: wh.SiteKey,
    description: wh.Description,
    shortAddress: wh.ShortAddress,
    number: String(wh.Number),
    typeOfWarehouse: wh.TypeOfWarehouse,
  }));
}
