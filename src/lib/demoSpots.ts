export type DemoSpot = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

export const DEMO_SPOTS: DemoSpot[] = [
  { id: "shibuya", label: "渋谷スクランブル交差点", lat: 35.6595, lng: 139.7005 },
  { id: "shinjuku", label: "新宿駅東口", lat: 35.6909, lng: 139.7006 },
  { id: "shinbashi", label: "新橋駅 SL広場", lat: 35.6664, lng: 139.7585 },
  { id: "osaka", label: "大阪・道頓堀", lat: 34.6687, lng: 135.5012 },
  { id: "kyoto", label: "京都・清水寺", lat: 34.9949, lng: 135.7849 },
  { id: "sf", label: "San Francisco · Ferry Building", lat: 37.7956, lng: -122.3935 },
];
