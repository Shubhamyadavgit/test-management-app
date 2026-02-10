import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import testReducer from "./slices/testSlice";
import subjectReducer from "./slices/subjectSlice";
import topicReducer from "./slices/topicSlice";
import subTopicReducer from "./slices/subTopicSlice";
import testFlowReducer from "./slices/testFlowSlice";
import questionReducer from "./slices/questionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    test: testReducer,
    subjects: subjectReducer,
    topics: topicReducer,
    subTopics: subTopicReducer,
    testFlow: testFlowReducer,
    questions: questionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
