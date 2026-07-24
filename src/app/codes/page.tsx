import CopyList, { CopyItem } from "@/components/Reusable/CopyList";

const codeItems: CopyItem[] = [
  {
    id: "addHideOOP",
    label: "Ad Hide",
    type: "code",
    text: `<style>
    .glacier-ad,.revcontent,.glacier-ad.interstitial,.glacier-ad.oop, 
    .glacier-ad.interstitial,.glacier-ad.oop{display:none!important}
</style>`,
  },
  {
    id: "addHideAppOne",
    label: "App (One) Ad Hide No Tag",
    type: "code",
    text: `<style>
    #today-top,#today-middle,#today-bottom,#oop,#interstitial{display:none !important}
</style>`,
  },
  {
    id: "addHideAppOneNoTag",
    label: "App (One) Ad Hide",
    type: "code",
    text: `
    #today-top,#today-middle,#today-bottom,#oop,#interstitial{display:none !important}
    `,
  },
  {
    id: "weatherScript",
    label: "icon Change",
    type: "code",
    text: `<script>
    import { changeWeatherData } from 'https://tpc.googlesyndication.com/pimgad/9248386624894063117?';
    const requiredWeatherType = 'rain';
    const temUnit = 'F';
    changeWeatherData({requiredWeatherType, temUnit});
</script>`,
  },
];

const ComponentName = () => {
  return (
    <>
      <CopyList items={codeItems} />
    </>
  );
};

export default ComponentName;
