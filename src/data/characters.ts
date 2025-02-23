import { Character } from '@/types/character-types';

export const characters: { [key: string]: Character } = {
    mother: {
        id: 'mother',
        name: 'Mother',
        currentQuestionIndex: 0,
        image: '/mickey_photos/mickey_mother.png',
        questions: [
            {
                text: "What do we say when someone gives us a gift?",
                answer: "thank you"
            },
            {
                text: "How do we ask politely for something?",
                answer: "please"
            },
            {
                text: "What's the past tense of 'eat'?",
                answer: "ate"
            },
            {
                text: "How do we greet someone in the morning?",
                answer: "good morning"
            },
            {
                text: "What do we say before going to bed?",
                answer: "good night"
            }
        ],
        getCurrentQuestion() {
            return this.questions[this.currentQuestionIndex];
        },
        setQuestionIndex(index: number) {
            this.currentQuestionIndex = index;
        }
    },
    father: {
        id: 'father',
        name: 'Father',
        currentQuestionIndex: 0,
        image: '/mickey_photos/mickey_father.png',
        questions: [
            {
                text: "What's the opposite of 'work'?",
                answer: "rest"
            },
            {
                text: "When something is very important, it is...?",
                answer: "urgent"
            },
            {
                text: "What do we call a person who teaches?",
                answer: "teacher"
            },
            {
                text: "What's the past tense of 'go'?",
                answer: "went"
            },
            {
                text: "What do we say when we agree with someone?",
                answer: "yes"
            }
        ],
        getCurrentQuestion() {
            return this.questions[this.currentQuestionIndex];
        },
        setQuestionIndex(index: number) {
            this.currentQuestionIndex = index;
        }
    },
    brother: {
        id: 'brother',
        name: 'Brother',
        currentQuestionIndex: 0,
        image: '/mickey_photos/mickey_brother.png',
        questions: [
            {
                text: "What do we use to play video games?",
                answer: "controller"
            },
            {
                text: "What's another word for 'happy'?",
                answer: "joyful"
            },
            {
                text: "What do we say when we win a game?",
                answer: "victory"
            },
            {
                text: "What's the opposite of 'lose'?",
                answer: "win"
            },
            {
                text: "What do you call a person who plays games?",
                answer: "player"
            }
        ],
        getCurrentQuestion() {
            return this.questions[this.currentQuestionIndex];
        },
        setQuestionIndex(index: number) {
            this.currentQuestionIndex = index;
        }
    },
    neighbour: {
        id: 'neighbour',
        name: 'Neighbour',
        currentQuestionIndex: 0,
        image: '/mickey_photos/mickey_neighbor.png',
        questions: [
            {
                text: "What color are most leaves?",
                answer: "green"
            },
            {
                text: "What do plants need to grow?",
                answer: "water"
            },
            {
                text: "What season do flowers bloom?",
                answer: "spring"
            },
            {
                text: "What's the opposite of 'day'?",
                answer: "night"
            },
            {
                text: "What do bees make?",
                answer: "honey"
            }
        ],
        getCurrentQuestion() {
            return this.questions[this.currentQuestionIndex];
        },
        setQuestionIndex(index: number) {
            this.currentQuestionIndex = index;
        }
    }
}; 