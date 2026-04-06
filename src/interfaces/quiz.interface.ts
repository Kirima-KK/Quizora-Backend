import { ParamsDictionary } from "express-serve-static-core";

export interface Choice {
  id: number;
  choice: string;
}

export interface Question {
  id: number;
  question: string;
  choices: Choice[];
  answer: number;
}

export interface QuizInfo {
  _id: string;
  name: string;
  description: string;
  image: string;
  passPoint: number;
  questions: Question[];
}

export interface QuizParams extends ParamsDictionary {
  id: string
}