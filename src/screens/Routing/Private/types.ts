export enum PrivateScreen {
  Home = 'Home',
  ScreenTwo = 'ScreenTwo',
}

export type DrawerParamList = {
  [PrivateScreen.Home]: { environment?: string };
  [PrivateScreen.ScreenTwo]: undefined;
};
