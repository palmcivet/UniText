import { INotificationState } from "@/typings/modules/notification";

const state = {};

const getters = {};

const mutations = {
  SET_INFO: (moduleState: INotificationState, msg: string) => {
    console.log(msg);
  },
  SET_WARN: (moduleState: INotificationState, msg: string) => {
    console.log(msg);
  },
  SET_ERROR: (moduleState: INotificationState, msg: string) => {
    console.error(msg);
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
