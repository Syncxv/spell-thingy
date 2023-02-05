use std::time::SystemTime;

use rand;
use uuid::Uuid;
#[derive(Debug, Clone)]
struct Letter {
    id: Uuid,
    // the char code - 64. A = 1, B = 2
    value: i32,
    // A, B, C etc yk
    key: char,

    row: i32,

    column: i32,
}

impl Letter {
    pub fn new(id: Uuid, value: i32, key: char, row: i32, column: i32) -> Letter {
        Letter {
            id,
            value,
            column,
            key,
            row,
        }
    }
}

const alphabet: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const size: i32 = 5;
const DIRECTIONS: [[i32; 2]; 8] = [
    [-1, 0],  // up
    [0, 1],   // right
    [1, 0],   // down
    [0, -1],  // left
    [-1, 1],  // up-right
    [1, 1],   // down-right
    [1, -1],  // down-left
    [-1, -1], // up-left
];

fn getAllCombinations<'a>(
    grid: &'a Vec<Vec<Letter>>,
    row: i32,
    col: i32,
    visited: &mut Vec<Vec<bool>>,
    mut combination: Vec<&'a Letter>,
    allCombinations: &mut Vec<Vec<&'a Letter>>,
    desired: i32,
) {
    if row < 0 || row >= size || col < 0 || col >= size || visited[row as usize][col as usize] {
        return;
    }

    visited[row as usize][col as usize] = true;

    combination.push(&grid[row as usize][col as usize]);
    if (combination.len() == desired as usize) {
        allCombinations.push(combination);
    } else {
        for [dx, dy] in DIRECTIONS.into_iter() {
            getAllCombinations(
                grid,
                row + dx,
                col + dy,
                visited,
                combination.clone(),
                allCombinations,
                desired,
            );
        }
    }

    // combination.clone().pop();
    visited[row as usize][col as usize] = false;
}
fn main() {
    let mut grid: Vec<Vec<Letter>> = vec![];
    for row in 0..size {
        grid.push(vec![]);
        for col in 0..size {
            grid[row as usize].push(Letter::new(
                Uuid::new_v4(),
                0,
                rand::sample(&mut rand::thread_rng(), alphabet.chars(), 1)[0],
                row.try_into().unwrap(),
                col,
            ));
        }
    }

    let mut allCombinations: Vec<Vec<&Letter>> = vec![];
    let mut combination: Vec<&Letter> = vec![];
    let mut visited: Vec<Vec<bool>> = vec![vec![false; size as usize]; size as usize];

    // start the recursive process from each cell in the grid
    let start = SystemTime::now();

    for row1 in 0..size {
        for col1 in 0..size {
            getAllCombinations(
                &grid,
                row1,
                col1,
                &mut visited,
                combination.clone(),
                &mut allCombinations,
                4,
            );
        }
    }
    let end = SystemTime::now();
    let duration = end.duration_since(start).unwrap();

    for (i, row) in allCombinations.iter().enumerate() {
        let res = row
            .iter()
            .map(|x| String::from(x.key))
            .collect::<Vec<String>>()
            .join("");
        print!("{}\n", res);
    }
    println!("it took {} seconds", duration.as_secs());
    println!("ho, {:?}", allCombinations.len());
}
