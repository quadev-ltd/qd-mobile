export enum PrivateScreen {
  Home = 'Home',
  DeleteAccount = 'Delete account',
}

export type DrawerParamList = {
  [PrivateScreen.Home]: { environment?: string };
  [PrivateScreen.DeleteAccount]: undefined;
};
