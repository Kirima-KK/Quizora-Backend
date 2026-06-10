/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'quizora-local';
const collection = 'quizes';

// Create a new database.
use(database);

// Insert quizes data.
db.quizes.insertMany(
  [
    {
      "name": "Wild Kingdom: Animal Adventure",
      "description": "Explore the fascinating world of animals with this engaging quiz. Learn about the fastest creatures, unique species, and interesting behaviors across the animal kingdom. From oceans to jungles, test how well you know wildlife and their habitats.",
      "image": "https://images.pexels.com/photos/2786709/pexels-photo-2786709.jpeg?_gl=1*1m7var9*_ga*NzA1NDM4Njk3LjE3NjM2OTY0MDU.*_ga_8JE65Q40S6*czE3NjM2OTY0MDUkbzEkZzEkdDE3NjM2OTY4MzckajMkbDAkaDA.",
      "passPoint": 6,
      "questions": [
        {
          "id": 1,
          "question": "What is the fastest land animal?",
          "choices": [
            {
              "id": 1,
              "choice": "Cheetah"
            },
            {
              "id": 2,
              "choice": "Lion"
            },
            {
              "id": 3,
              "choice": "Tiger"
            },
            {
              "id": 4,
              "choice": "Horse"
            }
          ],
          "answer": 1
        },
        {
          "id": 2,
          "question": "Which animal is known as the King of the Jungle?",
          "choices": [
            {
              "id": 1,
              "choice": "Tiger"
            },
            {
              "id": 2,
              "choice": "Lion"
            },
            {
              "id": 3,
              "choice": "Elephant"
            },
            {
              "id": 4,
              "choice": "Leopard"
            }
          ],
          "answer": 2
        },
        {
          "id": 3,
          "question": "Which bird is a universal symbol of peace?",
          "choices": [
            {
              "id": 1,
              "choice": "Dove"
            },
            {
              "id": 2,
              "choice": "Eagle"
            },
            {
              "id": 3,
              "choice": "Swan"
            },
            {
              "id": 4,
              "choice": "Owl"
            }
          ],
          "answer": 1
        },
        {
          "id": 4,
          "question": "How many legs do spiders have?",
          "choices": [
            {
              "id": 1,
              "choice": "6"
            },
            {
              "id": 2,
              "choice": "8"
            },
            {
              "id": 3,
              "choice": "10"
            },
            {
              "id": 4,
              "choice": "12"
            }
          ],
          "answer": 2
        },
        {
          "id": 5,
          "question": "Which mammal lays eggs?",
          "choices": [
            {
              "id": 1,
              "choice": "Platypus"
            },
            {
              "id": 2,
              "choice": "Kangaroo"
            },
            {
              "id": 3,
              "choice": "Elephant"
            },
            {
              "id": 4,
              "choice": "Whale"
            }
          ],
          "answer": 1
        },
        {
          "id": 6,
          "question": "What is a group of lions called?",
          "choices": [
            {
              "id": 1,
              "choice": "Herd"
            },
            {
              "id": 2,
              "choice": "Pack"
            },
            {
              "id": 3,
              "choice": "Pride"
            },
            {
              "id": 4,
              "choice": "Colony"
            }
          ],
          "answer": 3
        },
        {
          "id": 7,
          "question": "Which is the largest species of shark?",
          "choices": [
            {
              "id": 1,
              "choice": "Great White Shark"
            },
            {
              "id": 2,
              "choice": "Tiger Shark"
            },
            {
              "id": 3,
              "choice": "Whale Shark"
            },
            {
              "id": 4,
              "choice": "Hammerhead Shark"
            }
          ],
          "answer": 3
        },
        {
          "id": 8,
          "question": "Which animal is known for changing colors for camouflage?",
          "choices": [
            {
              "id": 1,
              "choice": "Chameleon"
            },
            {
              "id": 2,
              "choice": "Octopus"
            },
            {
              "id": 3,
              "choice": "Cuttlefish"
            },
            {
              "id": 4,
              "choice": "All of the above"
            }
          ],
          "answer": 4
        },
        {
          "id": 9,
          "question": "What is the largest land animal?",
          "choices": [
            {
              "id": 1,
              "choice": "Elephant"
            },
            {
              "id": 2,
              "choice": "Rhinoceros"
            },
            {
              "id": 3,
              "choice": "Hippo"
            },
            {
              "id": 4,
              "choice": "Giraffe"
            }
          ],
          "answer": 1
        },
        {
          "id": 10,
          "question": "Which animal is famous for its black and white stripes?",
          "choices": [
            {
              "id": 1,
              "choice": "Zebra"
            },
            {
              "id": 2,
              "choice": "Tiger"
            },
            {
              "id": 3,
              "choice": "Panda"
            },
            {
              "id": 4,
              "choice": "Skunk"
            }
          ],
          "answer": 1
        }
      ]
    },
    {
      "name": "Rhythm & Beats: Music Mania",
      "description": "Test your knowledge of music history, genres, and famous artists in this lively quiz. From classical masterpieces to modern pop hits, challenge yourself on songs, albums, and musical milestones. Can you hit the right note and show your music expertise?",
      "image": "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?_gl=1*lh6x85*_ga*NzA1NDM4Njk3LjE3NjM2OTY0MDU.*_ga_8JE65Q40S6*czE3NjM2OTY0MDUkbzEkZzEkdDE3NjM2OTY4OTEkajMyJGwwJGgw",
      "passPoint": 6,
      "questions": [
        {
          "id": 1,
          "question": "Who is known as the King of Pop?",
          "choices": [
            {
              "id": 1,
              "choice": "Elvis Presley"
            },
            {
              "id": 2,
              "choice": "Michael Jackson"
            },
            {
              "id": 3,
              "choice": "Prince"
            },
            {
              "id": 4,
              "choice": "Freddie Mercury"
            }
          ],
          "answer": 2
        },
        {
          "id": 2,
          "question": "Which band released the album 'Abbey Road'?",
          "choices": [
            {
              "id": 1,
              "choice": "The Beatles"
            },
            {
              "id": 2,
              "choice": "The Rolling Stones"
            },
            {
              "id": 3,
              "choice": "Queen"
            },
            {
              "id": 4,
              "choice": "Pink Floyd"
            }
          ],
          "answer": 1
        },
        {
          "id": 3,
          "question": "What is the highest female singing voice called?",
          "choices": [
            {
              "id": 1,
              "choice": "Alto"
            },
            {
              "id": 2,
              "choice": "Soprano"
            },
            {
              "id": 3,
              "choice": "Tenor"
            },
            {
              "id": 4,
              "choice": "Mezzo-Soprano"
            }
          ],
          "answer": 2
        },
        {
          "id": 4,
          "question": "Which instrument has 88 keys?",
          "choices": [
            {
              "id": 1,
              "choice": "Piano"
            },
            {
              "id": 2,
              "choice": "Guitar"
            },
            {
              "id": 3,
              "choice": "Violin"
            },
            {
              "id": 4,
              "choice": "Flute"
            }
          ],
          "answer": 1
        },
        {
          "id": 5,
          "question": "Which composer wrote 'Fur Elise'?",
          "choices": [
            {
              "id": 1,
              "choice": "Mozart"
            },
            {
              "id": 2,
              "choice": "Beethoven"
            },
            {
              "id": 3,
              "choice": "Bach"
            },
            {
              "id": 4,
              "choice": "Chopin"
            }
          ],
          "answer": 2
        },
        {
          "id": 6,
          "question": "Which genre is BTS primarily known for?",
          "choices": [
            {
              "id": 1,
              "choice": "K-Pop"
            },
            {
              "id": 2,
              "choice": "Rock"
            },
            {
              "id": 3,
              "choice": "Jazz"
            },
            {
              "id": 4,
              "choice": "Hip-Hop"
            }
          ],
          "answer": 1
        },
        {
          "id": 7,
          "question": "Which singer is known for the hit 'Rolling in the Deep'?",
          "choices": [
            {
              "id": 1,
              "choice": "Adele"
            },
            {
              "id": 2,
              "choice": "Taylor Swift"
            },
            {
              "id": 3,
              "choice": "Beyoncé"
            },
            {
              "id": 4,
              "choice": "Lady Gaga"
            }
          ],
          "answer": 1
        },
        {
          "id": 8,
          "question": "Which classical composer was deaf?",
          "choices": [
            {
              "id": 1,
              "choice": "Mozart"
            },
            {
              "id": 2,
              "choice": "Beethoven"
            },
            {
              "id": 3,
              "choice": "Bach"
            },
            {
              "id": 4,
              "choice": "Haydn"
            }
          ],
          "answer": 2
        },
        {
          "id": 9,
          "question": "Which instrument is often called the 'King of Instruments'?",
          "choices": [
            {
              "id": 1,
              "choice": "Guitar"
            },
            {
              "id": 2,
              "choice": "Piano"
            },
            {
              "id": 3,
              "choice": "Organ"
            },
            {
              "id": 4,
              "choice": "Violin"
            }
          ],
          "answer": 3
        },
        {
          "id": 10,
          "question": "What is the term for a gradual increase in loudness?",
          "choices": [
            {
              "id": 1,
              "choice": "Forte"
            },
            {
              "id": 2,
              "choice": "Crescendo"
            },
            {
              "id": 3,
              "choice": "Decrescendo"
            },
            {
              "id": 4,
              "choice": "Staccato"
            }
          ],
          "answer": 2
        }
      ]
    },
    {
      "name": "Level Up: Gaming Challenge",
      "description": "Dive into the world of video games and test your knowledge across multiple genres. From classic arcade hits to modern blockbusters, this quiz will challenge casual and hardcore gamers alike. Can you identify the characters, consoles, and iconic moments that shaped gaming history?",
      "image": "https://images.pexels.com/photos/159393/gamepad-video-game-controller-game-controller-controller-159393.jpeg?_gl=1*10zsta7*_ga*NzA1NDM4Njk3LjE3NjM2OTY0MDU.*_ga_8JE65Q40S6*czE3NjM2OTY0MDUkbzEkZzEkdDE3NjM2OTY0NzAkajU2JGwwJGgw",
      "passPoint": 6,
      "questions": [
        {
          "id": 1,
          "question": "Which game features the character 'Master Chief'?",
          "choices": [
            {
              "id": 1,
              "choice": "Halo"
            },
            {
              "id": 2,
              "choice": "Call of Duty"
            },
            {
              "id": 3,
              "choice": "Gears of War"
            },
            {
              "id": 4,
              "choice": "Overwatch"
            }
          ],
          "answer": 1
        },
        {
          "id": 2,
          "question": "In Mario Kart, which item can throw a shell backwards?",
          "choices": [
            {
              "id": 1,
              "choice": "Banana"
            },
            {
              "id": 2,
              "choice": "Red Shell"
            },
            {
              "id": 3,
              "choice": "Green Shell"
            },
            {
              "id": 4,
              "choice": "Mushroom"
            }
          ],
          "answer": 2
        },
        {
          "id": 3,
          "question": "Which game popularized the 'Battle Royale' genre?",
          "choices": [
            {
              "id": 1,
              "choice": "Fortnite"
            },
            {
              "id": 2,
              "choice": "PUBG"
            },
            {
              "id": 3,
              "choice": "Apex Legends"
            },
            {
              "id": 4,
              "choice": "Call of Duty: Warzone"
            }
          ],
          "answer": 2
        },
        {
          "id": 4,
          "question": "In which game do players explore Hyrule?",
          "choices": [
            {
              "id": 1,
              "choice": "The Legend of Zelda"
            },
            {
              "id": 2,
              "choice": "Final Fantasy"
            },
            {
              "id": 3,
              "choice": "Elder Scrolls"
            },
            {
              "id": 4,
              "choice": "Dark Souls"
            }
          ],
          "answer": 1
        },
        {
          "id": 5,
          "question": "Which Pokemon is known as the mascot of the franchise?",
          "choices": [
            {
              "id": 1,
              "choice": "Charmander"
            },
            {
              "id": 2,
              "choice": "Squirtle"
            },
            {
              "id": 3,
              "choice": "Pikachu"
            },
            {
              "id": 4,
              "choice": "Bulbasaur"
            }
          ],
          "answer": 3
        },
        {
          "id": 6,
          "question": "What is the name of the main character in 'The Witcher' series?",
          "choices": [
            {
              "id": 1,
              "choice": "Geralt of Rivia"
            },
            {
              "id": 2,
              "choice": "Yennefer"
            },
            {
              "id": 3,
              "choice": "Ciri"
            },
            {
              "id": 4,
              "choice": "Triss Merigold"
            }
          ],
          "answer": 1
        },
        {
          "id": 7,
          "question": "Which console is made by Sony?",
          "choices": [
            {
              "id": 1,
              "choice": "Xbox"
            },
            {
              "id": 2,
              "choice": "PlayStation"
            },
            {
              "id": 3,
              "choice": "Switch"
            },
            {
              "id": 4,
              "choice": "Sega Genesis"
            }
          ],
          "answer": 2
        },
        {
          "id": 8,
          "question": "Which game features a world called 'San Andreas'?",
          "choices": [
            {
              "id": 1,
              "choice": "GTA: San Andreas"
            },
            {
              "id": 2,
              "choice": "Red Dead Redemption"
            },
            {
              "id": 3,
              "choice": "Saints Row"
            },
            {
              "id": 4,
              "choice": "Mafia"
            }
          ],
          "answer": 1
        },
        {
          "id": 9,
          "question": "What is the goal in Tetris?",
          "choices": [
            {
              "id": 1,
              "choice": "Build castles"
            },
            {
              "id": 2,
              "choice": "Match colors"
            },
            {
              "id": 3,
              "choice": "Complete horizontal lines"
            },
            {
              "id": 4,
              "choice": "Solve puzzles"
            }
          ],
          "answer": 3
        },
        {
          "id": 10,
          "question": "Which company develops 'Assassin’s Creed'?",
          "choices": [
            {
              "id": 1,
              "choice": "Ubisoft"
            },
            {
              "id": 2,
              "choice": "EA Sports"
            },
            {
              "id": 3,
              "choice": "Nintendo"
            },
            {
              "id": 4,
              "choice": "Blizzard"
            }
          ],
          "answer": 1
        }
      ]
    },
    {
      "name": "Masterpieces & More: Art Quest",
      "description": "Challenge your knowledge of art history, famous paintings, and iconic artists in this creative quiz. From Renaissance classics to modern art movements, test how well you can recognize masterpieces and artistic techniques. Unleash your inner art connoisseur and explore the colorful world of art.",
      "image": "https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?_gl=1*rjspvv*_ga*NzA1NDM4Njk3LjE3NjM2OTY0MDU.*_ga_8JE65Q40S6*czE3NjM2OTY0MDUkbzEkZzEkdDE3NjM2OTcwODEkajU5JGwwJGgw",
      "passPoint": 6,
      "questions": [
        {
          "id": 1,
          "question": "Who painted the Mona Lisa?",
          "choices": [
            {
              "id": 1,
              "choice": "Vincent van Gogh"
            },
            {
              "id": 2,
              "choice": "Pablo Picasso"
            },
            {
              "id": 3,
              "choice": "Leonardo da Vinci"
            },
            {
              "id": 4,
              "choice": "Michelangelo"
            }
          ],
          "answer": 3
        },
        {
          "id": 2,
          "question": "Which art movement is Salvador Dali associated with?",
          "choices": [
            {
              "id": 1,
              "choice": "Surrealism"
            },
            {
              "id": 2,
              "choice": "Impressionism"
            },
            {
              "id": 3,
              "choice": "Cubism"
            },
            {
              "id": 4,
              "choice": "Baroque"
            }
          ],
          "answer": 1
        },
        {
          "id": 3,
          "question": "The Starry Night was painted by?",
          "choices": [
            {
              "id": 1,
              "choice": "Claude Monet"
            },
            {
              "id": 2,
              "choice": "Vincent van Gogh"
            },
            {
              "id": 3,
              "choice": "Edvard Munch"
            },
            {
              "id": 4,
              "choice": "Pablo Picasso"
            }
          ],
          "answer": 2
        },
        {
          "id": 4,
          "question": "Which artist is famous for the painting 'Guernica'?",
          "choices": [
            {
              "id": 1,
              "choice": "Pablo Picasso"
            },
            {
              "id": 2,
              "choice": "Salvador Dali"
            },
            {
              "id": 3,
              "choice": "Frida Kahlo"
            },
            {
              "id": 4,
              "choice": "Rembrandt"
            }
          ],
          "answer": 1
        },
        {
          "id": 5,
          "question": "Which city is home to the Louvre Museum?",
          "choices": [
            {
              "id": 1,
              "choice": "London"
            },
            {
              "id": 2,
              "choice": "Paris"
            },
            {
              "id": 3,
              "choice": "Rome"
            },
            {
              "id": 4,
              "choice": "New York"
            }
          ],
          "answer": 2
        },
        {
          "id": 6,
          "question": "Which painting technique uses tiny dots to create an image?",
          "choices": [
            {
              "id": 1,
              "choice": "Pointillism"
            },
            {
              "id": 2,
              "choice": "Fresco"
            },
            {
              "id": 3,
              "choice": "Impasto"
            },
            {
              "id": 4,
              "choice": "Watercolor"
            }
          ],
          "answer": 1
        },
        {
          "id": 7,
          "question": "Who painted 'The Last Supper'?",
          "choices": [
            {
              "id": 1,
              "choice": "Leonardo da Vinci"
            },
            {
              "id": 2,
              "choice": "Michelangelo"
            },
            {
              "id": 3,
              "choice": "Raphael"
            },
            {
              "id": 4,
              "choice": "Titian"
            }
          ],
          "answer": 1
        },
        {
          "id": 8,
          "question": "Which art movement features abstract shapes and geometric forms?",
          "choices": [
            {
              "id": 1,
              "choice": "Cubism"
            },
            {
              "id": 2,
              "choice": "Impressionism"
            },
            {
              "id": 3,
              "choice": "Realism"
            },
            {
              "id": 4,
              "choice": "Baroque"
            }
          ],
          "answer": 1
        },
        {
          "id": 9,
          "question": "Which artist is known for 'The Persistence of Memory'?",
          "choices": [
            {
              "id": 1,
              "choice": "Salvador Dali"
            },
            {
              "id": 2,
              "choice": "Vincent van Gogh"
            },
            {
              "id": 3,
              "choice": "Claude Monet"
            },
            {
              "id": 4,
              "choice": "Henri Matisse"
            }
          ],
          "answer": 1
        },
        {
          "id": 10,
          "question": "Which type of paint is water-based and dries quickly?",
          "choices": [
            {
              "id": 1,
              "choice": "Oil"
            },
            {
              "id": 2,
              "choice": "Acrylic"
            },
            {
              "id": 3,
              "choice": "Fresco"
            },
            {
              "id": 4,
              "choice": "Tempera"
            }
          ],
          "answer": 2
        }
      ]
    },
    {
      "name": "Deep Blue: Marine Quiz",
      "description": "Dive beneath the waves and discover the wonders of marine life. From coral reefs to ocean giants, this quiz tests your knowledge of the sea.",
      "image": "https://images.pexels.com/photos/889929/pexels-photo-889929.jpeg?_gl=1*6v1hna*_ga*MjMwODA5MzM0LjE3NjYzOTA0NTE.*_ga_8JE65Q40S6*czE3NjYzOTA0NTEkbzEkZzEkdDE3NjYzOTEwNTckajU5JGwwJGgw",
      "passPoint": 6,
      "questions": [
        {
          "id": 1,
          "question": "What is the largest animal in the ocean?",
          "choices": [
            {
              "id": 1,
              "choice": "Great White Shark"
            },
            {
              "id": 2,
              "choice": "Blue Whale"
            },
            {
              "id": 3,
              "choice": "Giant Squid"
            },
            {
              "id": 4,
              "choice": "Orca"
            }
          ],
          "answer": 2
        },
        {
          "id": 2,
          "question": "Which marine animal has eight arms?",
          "choices": [
            {
              "id": 1,
              "choice": "Jellyfish"
            },
            {
              "id": 2,
              "choice": "Octopus"
            },
            {
              "id": 3,
              "choice": "Starfish"
            },
            {
              "id": 4,
              "choice": "Crab"
            }
          ],
          "answer": 2
        },
        {
          "id": 3,
          "question": "What do corals primarily build?",
          "choices": [
            {
              "id": 1,
              "choice": "Shells"
            },
            {
              "id": 2,
              "choice": "Reefs"
            },
            {
              "id": 3,
              "choice": "Sand"
            },
            {
              "id": 4,
              "choice": "Nests"
            }
          ],
          "answer": 2
        },
        {
          "id": 4,
          "question": "Which ocean is the largest?",
          "choices": [
            {
              "id": 1,
              "choice": "Atlantic"
            },
            {
              "id": 2,
              "choice": "Indian"
            },
            {
              "id": 3,
              "choice": "Pacific"
            },
            {
              "id": 4,
              "choice": "Arctic"
            }
          ],
          "answer": 3
        },
        {
          "id": 5,
          "question": "What marine animal is known for changing colors?",
          "choices": [
            {
              "id": 1,
              "choice": "Dolphin"
            },
            {
              "id": 2,
              "choice": "Octopus"
            },
            {
              "id": 3,
              "choice": "Turtle"
            },
            {
              "id": 4,
              "choice": "Seal"
            }
          ],
          "answer": 2
        },
        {
          "id": 6,
          "question": "Which fish is famous for its sharp teeth?",
          "choices": [
            {
              "id": 1,
              "choice": "Tuna"
            },
            {
              "id": 2,
              "choice": "Shark"
            },
            {
              "id": 3,
              "choice": "Clownfish"
            },
            {
              "id": 4,
              "choice": "Mackerel"
            }
          ],
          "answer": 2
        },
        {
          "id": 7,
          "question": "What protects sea turtles?",
          "choices": [
            {
              "id": 1,
              "choice": "Fur"
            },
            {
              "id": 2,
              "choice": "Shell"
            },
            {
              "id": 3,
              "choice": "Scales"
            },
            {
              "id": 4,
              "choice": "Skin"
            }
          ],
          "answer": 2
        },
        {
          "id": 8,
          "question": "Which marine mammal is known for echolocation?",
          "choices": [
            {
              "id": 1,
              "choice": "Whale"
            },
            {
              "id": 2,
              "choice": "Dolphin"
            },
            {
              "id": 3,
              "choice": "Seal"
            },
            {
              "id": 4,
              "choice": "Manatee"
            }
          ],
          "answer": 2
        },
        {
          "id": 9,
          "question": "What is plankton?",
          "choices": [
            {
              "id": 1,
              "choice": "Large fish"
            },
            {
              "id": 2,
              "choice": "Tiny drifting organisms"
            },
            {
              "id": 3,
              "choice": "Sea plants"
            },
            {
              "id": 4,
              "choice": "Shellfish"
            }
          ],
          "answer": 2
        },
        {
          "id": 10,
          "question": "Which zone of the ocean receives sunlight?",
          "choices": [
            {
              "id": 1,
              "choice": "Abyssal"
            },
            {
              "id": 2,
              "choice": "Hadal"
            },
            {
              "id": 3,
              "choice": "Sunlit (Euphotic)"
            },
            {
              "id": 4,
              "choice": "Midnight"
            }
          ],
          "answer": 3
        }
      ]
    },
    {
      "name": "Legends & Gods: Myth Quiz",
      "description": "Step into the world of myths and legends. Test your knowledge of gods, heroes, and creatures from ancient civilizations.",
      "image": "https://images.pexels.com/photos/29144648/pexels-photo-29144648.jpeg?_gl=1*108eqxw*_ga*MjMwODA5MzM0LjE3NjYzOTA0NTE.*_ga_8JE65Q40S6*czE3NjYzOTA0NTEkbzEkZzEkdDE3NjYzOTEzNDEkajQwJGwwJGgw",
      "passPoint": 6,
      "questions": [
        {
          "id": 1,
          "question": "Who is the king of the Greek gods?",
          "choices": [
            {
              "id": 1,
              "choice": "Hades"
            },
            {
              "id": 2,
              "choice": "Zeus"
            },
            {
              "id": 3,
              "choice": "Poseidon"
            },
            {
              "id": 4,
              "choice": "Ares"
            }
          ],
          "answer": 2
        },
        {
          "id": 2,
          "question": "Which god rules the underworld?",
          "choices": [
            {
              "id": 1,
              "choice": "Apollo"
            },
            {
              "id": 2,
              "choice": "Hades"
            },
            {
              "id": 3,
              "choice": "Hermes"
            },
            {
              "id": 4,
              "choice": "Zeus"
            }
          ],
          "answer": 2
        },
        {
          "id": 3,
          "question": "Who is Thor in Norse mythology?",
          "choices": [
            {
              "id": 1,
              "choice": "God of Trickery"
            },
            {
              "id": 2,
              "choice": "God of Thunder"
            },
            {
              "id": 3,
              "choice": "God of War"
            },
            {
              "id": 4,
              "choice": "God of Wisdom"
            }
          ],
          "answer": 2
        },
        {
          "id": 4,
          "question": "Which creature has the body of a lion and head of a human?",
          "choices": [
            {
              "id": 1,
              "choice": "Minotaur"
            },
            {
              "id": 2,
              "choice": "Sphinx"
            },
            {
              "id": 3,
              "choice": "Centaur"
            },
            {
              "id": 4,
              "choice": "Hydra"
            }
          ],
          "answer": 2
        },
        {
          "id": 5,
          "question": "Who flew too close to the sun?",
          "choices": [
            {
              "id": 1,
              "choice": "Odysseus"
            },
            {
              "id": 2,
              "choice": "Icarus"
            },
            {
              "id": 3,
              "choice": "Achilles"
            },
            {
              "id": 4,
              "choice": "Hercules"
            }
          ],
          "answer": 2
        },
        {
          "id": 6,
          "question": "Which mythological creature breathes fire?",
          "choices": [
            {
              "id": 1,
              "choice": "Phoenix"
            },
            {
              "id": 2,
              "choice": "Dragon"
            },
            {
              "id": 3,
              "choice": "Griffin"
            },
            {
              "id": 4,
              "choice": "Cyclops"
            }
          ],
          "answer": 2
        },
        {
          "id": 7,
          "question": "Who is the Roman equivalent of Zeus?",
          "choices": [
            {
              "id": 1,
              "choice": "Mars"
            },
            {
              "id": 2,
              "choice": "Jupiter"
            },
            {
              "id": 3,
              "choice": "Neptune"
            },
            {
              "id": 4,
              "choice": "Pluto"
            }
          ],
          "answer": 2
        },
        {
          "id": 8,
          "question": "Which hero completed twelve labors?",
          "choices": [
            {
              "id": 1,
              "choice": "Perseus"
            },
            {
              "id": 2,
              "choice": "Hercules"
            },
            {
              "id": 3,
              "choice": "Theseus"
            },
            {
              "id": 4,
              "choice": "Jason"
            }
          ],
          "answer": 2
        },
        {
          "id": 9,
          "question": "Which Norse myth involves the end of the world?",
          "choices": [
            {
              "id": 1,
              "choice": "Valhalla"
            },
            {
              "id": 2,
              "choice": "Ragnarök"
            },
            {
              "id": 3,
              "choice": "Asgard"
            },
            {
              "id": 4,
              "choice": "Midgard"
            }
          ],
          "answer": 2
        },
        {
          "id": 10,
          "question": "Who is the goddess of wisdom?",
          "choices": [
            {
              "id": 1,
              "choice": "Hera"
            },
            {
              "id": 2,
              "choice": "Athena"
            },
            {
              "id": 3,
              "choice": "Aphrodite"
            },
            {
              "id": 4,
              "choice": "Demeter"
            }
          ],
          "answer": 2
        }
      ]
    },
    {
      "name": "Pages & Prose: Literature Quiz",
      "description": "Test your knowledge of classic and modern literature. From legendary authors to unforgettable characters, this quiz explores the written works that shaped storytelling across generations.",
      "image": "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?_gl=1*88oin7*_ga*MjMwODA5MzM0LjE3NjYzOTA0NTE.*_ga_8JE65Q40S6*czE3NjYzOTA0NTEkbzEkZzEkdDE3NjYzOTA1NDkkajI5JGwwJGgw",
      "passPoint": 6,
      "questions": [
        {
          "id": 1,
          "question": "Who wrote 'Romeo and Juliet'?",
          "choices": [
            {
              "id": 1,
              "choice": "William Shakespeare"
            },
            {
              "id": 2,
              "choice": "Charles Dickens"
            },
            {
              "id": 3,
              "choice": "Jane Austen"
            },
            {
              "id": 4,
              "choice": "Mark Twain"
            }
          ],
          "answer": 1
        },
        {
          "id": 2,
          "question": "Which novel features the character 'Hobbit' named Bilbo Baggins?",
          "choices": [
            {
              "id": 1,
              "choice": "The Lord of the Rings"
            },
            {
              "id": 2,
              "choice": "The Hobbit"
            },
            {
              "id": 3,
              "choice": "Narnia"
            },
            {
              "id": 4,
              "choice": "Eragon"
            }
          ],
          "answer": 2
        },
        {
          "id": 3,
          "question": "Who is the author of '1984'?",
          "choices": [
            {
              "id": 1,
              "choice": "George Orwell"
            },
            {
              "id": 2,
              "choice": "Aldous Huxley"
            },
            {
              "id": 3,
              "choice": "Ray Bradbury"
            },
            {
              "id": 4,
              "choice": "J.K. Rowling"
            }
          ],
          "answer": 1
        },
        {
          "id": 4,
          "question": "Which genre does 'Sherlock Holmes' belong to?",
          "choices": [
            {
              "id": 1,
              "choice": "Fantasy"
            },
            {
              "id": 2,
              "choice": "Mystery"
            },
            {
              "id": 3,
              "choice": "Romance"
            },
            {
              "id": 4,
              "choice": "Horror"
            }
          ],
          "answer": 2
        },
        {
          "id": 5,
          "question": "Who wrote 'Pride and Prejudice'?",
          "choices": [
            {
              "id": 1,
              "choice": "Emily Brontë"
            },
            {
              "id": 2,
              "choice": "Jane Austen"
            },
            {
              "id": 3,
              "choice": "Virginia Woolf"
            },
            {
              "id": 4,
              "choice": "Louisa May Alcott"
            }
          ],
          "answer": 2
        },
        {
          "id": 6,
          "question": "What is the fictional language created by Tolkien?",
          "choices": [
            {
              "id": 1,
              "choice": "Valyrian"
            },
            {
              "id": 2,
              "choice": "Elvish"
            },
            {
              "id": 3,
              "choice": "Dothraki"
            },
            {
              "id": 4,
              "choice": "Runic"
            }
          ],
          "answer": 2
        },
        {
          "id": 7,
          "question": "Which book series features the character Harry Potter?",
          "choices": [
            {
              "id": 1,
              "choice": "Percy Jackson"
            },
            {
              "id": 2,
              "choice": "Harry Potter"
            },
            {
              "id": 3,
              "choice": "Divergent"
            },
            {
              "id": 4,
              "choice": "The Maze Runner"
            }
          ],
          "answer": 2
        },
        {
          "id": 8,
          "question": "Who wrote 'The Old Man and the Sea'?",
          "choices": [
            {
              "id": 1,
              "choice": "Ernest Hemingway"
            },
            {
              "id": 2,
              "choice": "John Steinbeck"
            },
            {
              "id": 3,
              "choice": "F. Scott Fitzgerald"
            },
            {
              "id": 4,
              "choice": "J.D. Salinger"
            }
          ],
          "answer": 1
        },
        {
          "id": 9,
          "question": "Which literary movement includes authors like Edgar Allan Poe?",
          "choices": [
            {
              "id": 1,
              "choice": "Romanticism"
            },
            {
              "id": 2,
              "choice": "Realism"
            },
            {
              "id": 3,
              "choice": "Modernism"
            },
            {
              "id": 4,
              "choice": "Postmodernism"
            }
          ],
          "answer": 1
        },
        {
          "id": 10,
          "question": "What is a haiku?",
          "choices": [
            {
              "id": 1,
              "choice": "A short Japanese poem"
            },
            {
              "id": 2,
              "choice": "A long epic poem"
            },
            {
              "id": 3,
              "choice": "A fantasy novel"
            },
            {
              "id": 4,
              "choice": "A type of play"
            }
          ],
          "answer": 1
        }
      ]
    },
    {
      "name": "Global Bites: Food Quiz",
      "description": "Explore flavors from around the world! This quiz tests your knowledge of famous dishes, ingredients, and culinary traditions across cultures.",
      "image": "https://images.pexels.com/photos/2792186/pexels-photo-2792186.jpeg?_gl=1*4rdylq*_ga*MjMwODA5MzM0LjE3NjYzOTA0NTE.*_ga_8JE65Q40S6*czE3NjYzOTA0NTEkbzEkZzEkdDE3NjYzOTA5OTAkajU5JGwwJGgw",
      "passPoint": 6,
      "questions": [
        {
          "id": 1,
          "question": "Which country is sushi from?",
          "choices": [
            {
              "id": 1,
              "choice": "China"
            },
            {
              "id": 2,
              "choice": "Japan"
            },
            {
              "id": 3,
              "choice": "Korea"
            },
            {
              "id": 4,
              "choice": "Thailand"
            }
          ],
          "answer": 2
        },
        {
          "id": 2,
          "question": "What is the main ingredient in guacamole?",
          "choices": [
            {
              "id": 1,
              "choice": "Tomato"
            },
            {
              "id": 2,
              "choice": "Avocado"
            },
            {
              "id": 3,
              "choice": "Cucumber"
            },
            {
              "id": 4,
              "choice": "Pepper"
            }
          ],
          "answer": 2
        },
        {
          "id": 3,
          "question": "Which spice is commonly used in curry?",
          "choices": [
            {
              "id": 1,
              "choice": "Cinnamon"
            },
            {
              "id": 2,
              "choice": "Turmeric"
            },
            {
              "id": 3,
              "choice": "Vanilla"
            },
            {
              "id": 4,
              "choice": "Nutmeg"
            }
          ],
          "answer": 2
        },
        {
          "id": 4,
          "question": "Pizza originated in which country?",
          "choices": [
            {
              "id": 1,
              "choice": "France"
            },
            {
              "id": 2,
              "choice": "Italy"
            },
            {
              "id": 3,
              "choice": "Spain"
            },
            {
              "id": 4,
              "choice": "Greece"
            }
          ],
          "answer": 2
        },
        {
          "id": 5,
          "question": "Which food is made from fermented soybeans?",
          "choices": [
            {
              "id": 1,
              "choice": "Tofu"
            },
            {
              "id": 2,
              "choice": "Miso"
            },
            {
              "id": 3,
              "choice": "Rice"
            },
            {
              "id": 4,
              "choice": "Noodles"
            }
          ],
          "answer": 2
        },
        {
          "id": 6,
          "question": "What is the main ingredient of hummus?",
          "choices": [
            {
              "id": 1,
              "choice": "Lentils"
            },
            {
              "id": 2,
              "choice": "Chickpeas"
            },
            {
              "id": 3,
              "choice": "Beans"
            },
            {
              "id": 4,
              "choice": "Peas"
            }
          ],
          "answer": 2
        },
        {
          "id": 7,
          "question": "Which dessert is known as an Italian classic?",
          "choices": [
            {
              "id": 1,
              "choice": "Cheesecake"
            },
            {
              "id": 2,
              "choice": "Tiramisu"
            },
            {
              "id": 3,
              "choice": "Brownie"
            },
            {
              "id": 4,
              "choice": "Pudding"
            }
          ],
          "answer": 2
        },
        {
          "id": 8,
          "question": "What type of food is sashimi?",
          "choices": [
            {
              "id": 1,
              "choice": "Cooked fish"
            },
            {
              "id": 2,
              "choice": "Raw fish"
            },
            {
              "id": 3,
              "choice": "Fried fish"
            },
            {
              "id": 4,
              "choice": "Smoked fish"
            }
          ],
          "answer": 2
        },
        {
          "id": 9,
          "question": "Which country is famous for croissants?",
          "choices": [
            {
              "id": 1,
              "choice": "Germany"
            },
            {
              "id": 2,
              "choice": "France"
            },
            {
              "id": 3,
              "choice": "Belgium"
            },
            {
              "id": 4,
              "choice": "Austria"
            }
          ],
          "answer": 2
        },
        {
          "id": 10,
          "question": "What beverage is made from fermented grapes?",
          "choices": [
            {
              "id": 1,
              "choice": "Beer"
            },
            {
              "id": 2,
              "choice": "Wine"
            },
            {
              "id": 3,
              "choice": "Cider"
            },
            {
              "id": 4,
              "choice": "Juice"
            }
          ],
          "answer": 2
        }
      ]
    }
  ],
  { ordered: false }
);

// insert users data
// db.users.insertMany([
//   {
//     "email": "admin.quizora@gmail.com",
//     "firstName": "admin",
//     "lastName": "admin",
//     "password": "$2b$10$QHmr9l3ReIZKcysKowgIcuw3UjKxx6YFuIWJ0zD5dQ3/OBkohp55u",
//     "createdAt": {
//       "$date": "2026-03-23T08:36:16.047Z"
//     },
//     "role": "ADMIN",
//     "updatedAt": {
//       "$date": "2026-04-06T03:43:22.972Z"
//     },
//     "__v": 0,
//     "correctAnswers": 0,
//     "quizPassed": 0
//   },
//   {
//     "email": "manager.quizora@gmail.com",
//     "firstName": "manager",
//     "lastName": "manager",
//     "password": "$2b$10$1roP0cBbJ/ab9Dks2M7Kq.4/NAlROOu5jkfVrDdXSbAf2v1/zVksy",
//     "createdAt": {
//       "$date": "2026-03-23T08:38:37.535Z"
//     },
//     "role": "MANAGER",
//     "updatedAt": {
//       "$date": "2026-03-23T08:38:37.535Z"
//     },
//     "__v": 0
//   }
// ],
//   { ordered: false }
// );
