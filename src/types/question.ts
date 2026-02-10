export type QuestionForm = {
  type: string;

  question: string;

  option1: string;
  option2: string;
  option3: string;
  option4: string;

  correct_option: string;

  explanation?: string;
  difficulty?: string;
  media_url?: string;

  topic?: string;
  sub_topic?: string;
};
