export interface Question {
    text: string;
    answer: string;
}

export interface CharacterData {
    id: string;
    name: string;
    questions: Question[];
    image: string;
}

export class Character implements CharacterData {
    id: string;
    name: string;
    questions: Question[];
    image: string;
    currentQuestionIndex: number;

    constructor(data: CharacterData) {
        this.id = data.id;
        this.name = data.name;
        this.questions = data.questions;
        this.image = data.image;
        this.currentQuestionIndex = 0;
    }

    getCurrentQuestion(): Question {
        return this.questions[this.currentQuestionIndex];
    }

    setQuestionIndex(index: number) {
        this.currentQuestionIndex = index;
    }
} 