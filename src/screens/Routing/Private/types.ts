export enum PrivateScreen {
  Home = 'Home',
  DetectObject = 'Smart inspection',
  DeleteAccount = 'Delete account',
}

export type DrawerParamList = {
  [PrivateScreen.Home]: { environment?: string };
  [PrivateScreen.DeleteAccount]: undefined;
  [PrivateScreen.DetectObject]: undefined;
};
