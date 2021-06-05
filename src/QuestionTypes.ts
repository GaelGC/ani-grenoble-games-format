interface QuestionBase<TypeName> {
    type: TypeName;
    name: string;
    points: number;
    hints: string[];
};

interface BlindTestQuestion extends QuestionBase<"BlindTestQuestion"> {
    path: string;
};

interface TextQuestion extends QuestionBase<"TextQuestion"> {
    question: string;
    answer: string;
};

type Question = BlindTestQuestion | TextQuestion;

interface QuestionSet {
    questions: Question[];
};