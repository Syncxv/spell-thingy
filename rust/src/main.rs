use std::collections::HashMap;

type Letter = (
    // uuidv4
    String,
    // the char code - 64. A = 1, B = 2
    u32,
    // A, B, C etc yk
    String,
    u32,
    u32,
);

const DIRECTIONS: HashMap<&'static str, [i32; 2]> = [
    ("UP", [-1, 0]),          // up
    ("RIGHT", [0, 1]),        // right
    ("DOWN", [1, 0]),         // down
    ("LEFT", [0, -1]),        // left
    ("TOP-RIGHT", [-1, 1]),   // up-right
    ("BOTTOM-RIGHT", [1, 1]), // down-right
    ("BOTTOM-LEFT", [1, -1]), // down-left
    ("TOP-LEFT", [-1, -1]),   // up-left
]
.iter()
.cloned()
.collect();

fn get_all_combinations(
    grid: &Vec<Vec<Letter>>,
    row: usize,
    col: usize,
    visited: &mut Vec<Vec<bool>>,
    combination: &mut Vec<Letter>,
    all_combinations: &mut Vec<Vec<Letter>>,
    desired: u32,
) {
    if row >= grid.len() || col >= grid.len() || visited[row][col] {
        return;
    }

    visited[row][col] = true;

    // add the letter at this cell to the combination
    combination.push(grid[row][col]);
    // if the combination is of the desired length, add it to the allCombinations list
    if combination.len() as u32 == desired {
        all_combinations.push(combination.to_vec());
    } else {
        for (_, [dx, dy]) in DIRECTIONS.iter() {
            get_all_combinations(
                grid,
                (row as i32 + dx) as usize,
                (col as i32 + dy) as usize,
                visited,
                combination,
                all_combinations,
                desired,
            );
        }
    }

    combination.pop();
    visited[row][col] = false;
}
