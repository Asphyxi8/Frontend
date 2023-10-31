import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="https://linkup-etey.onrender.com/assets/genshin_ad.png"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>Genshin Impact</Typography>
        <Typography color={medium}>genshin.hoyoverse.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Follow the journey of Traveller through Tevyat to find their Twin.
        Play With Us Today
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;

