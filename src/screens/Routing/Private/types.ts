export enum PrivateScreen {
  Home = 'Home',
  HomeTwo = 'HomeTwo',
}

export type DrawerParamList = {
  [PrivateScreen.Home]: { environment?: string };
  [PrivateScreen.HomeTwo]: undefined;
};
