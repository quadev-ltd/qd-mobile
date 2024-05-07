import Reactotron, { networking } from "reactotron-react-native";
import { reactotronRedux } from 'reactotron-redux'

import { env } from '@/core/env';

const reactotron = Reactotron
  .configure({ name: env.APPLICATION_NAME })
  // @ts-expect-error
  .use(networking())
  .useReactNative({ asyncStorage: false })
  .use(reactotronRedux())
  .connect()

  export default reactotron;