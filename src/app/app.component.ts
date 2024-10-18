import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  selectedIndex: number = 0;
  grid: any;
  ROWS : number = 100;
  COLS : number = 100;
  name:string='';
  selectedOption: string = '';
  startInterval:any;
  numGeneration:number = 0;
  directions:number[][] =  [
    [-1, -1], [-1, 0], [-1, 1], 
    [0, -1],            [0, 1],     
    [1, -1],  [1, 0],   [1, 1]    
  ];
  constructor(){}

  ngOnInit(){
    this.gliderGun();
  }
  todos: { name:string, ROWS: number, COLS: number, numGeneration:number, grid:number[][] }[] = [];

  createNewUniverse() {
      this.todos.push(
        {
          name: this.name,
          ROWS: 100,
          COLS: 100,
          numGeneration: 0,
          grid: new Array(100).fill(0)
          .map(() => new Array(100).fill(0)), 
        }
      )
  }

  store(){
      this.todos[this.selectedIndex] = {
        name: this.name,
        ROWS: this.ROWS,
        COLS: this.COLS,
        numGeneration: this.numGeneration,
        grid:this.grid, 
      };

      console.log(this.grid)
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
  }

  loadUniverse(index:number){
    this.pause();
    this.selectedIndex = index;
    this.grid = this.todos[index].grid.map(arr => [...arr]);
    this.numGeneration=this.todos[index].numGeneration;
    this.ROWS = this.todos[index].ROWS;
    this.COLS = this.todos[index].COLS;
    this.name = this.todos[index].name;
  }

  toggleCell(i: number,j:number): void {
    this.grid[i][j] === 1 ? this.grid[i][j] = 0 : this.grid[i][j] = 1 ;
  }

  nextGeneration(grid: number[][], ROWS: number, COLS: number): number[][] {
    const nextGeneration = grid.map(arr => [...arr]);
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = grid[row][col];
        
        let numNeighbours = 0;

        for (const [x, y] of this.directions) {
          const x_cell = (row + x + ROWS) % ROWS;
          const y_cell = (col + y + COLS) % COLS;
          numNeighbours += grid[x_cell][y_cell]; 
      }

        if(cell === 1){
          if(numNeighbours<2)nextGeneration[row][col] = 0;
          if(numNeighbours===2 ||numNeighbours==3)nextGeneration[row][col] = 1;
          if(numNeighbours>3)nextGeneration[row][col] = 0;
        }else{
          if(numNeighbours===3)nextGeneration[row][col] = 1;
        }
      }
    }
    
    this.numGeneration+=1;
    return nextGeneration;
  }

  start(): void {
    if (this.startInterval) {
      return; 
    }
    this.startInterval = setInterval(() => {
      this.grid = this.nextGeneration(this.grid,this.ROWS,this.COLS);
    }, 0);
  }

  pause(): void {
  if (this.startInterval) {
    clearInterval(this.startInterval);
    this.startInterval = null;
  }
  }

  random(): void {
      this.grid = new Array(this.ROWS).fill(null)
      .map(() => new Array(this.COLS).fill(null)
        .map(() => Math.floor(Math.random() >0.5? 1:0)));
  }

  reset(): void {
    this.grid = new Array(this.ROWS).fill(0)
    .map(() => new Array(this.COLS).fill(0));
    this.numGeneration = 0;
    this.pause();
  }
  gliderGun():void{
    const gun:number[][]=[
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
    this.numGeneration = 0;
    this.grid=gun;
    this.reSize();
    this.pause();
  }

  reSize():void{
  if(this.ROWS >= this.grid.length && this.COLS >=this.grid[0].length){
    const expandedArray: number[][] = new Array(this.ROWS).fill(0)
    .map(() => new Array(this.COLS).fill(0));
    const startRow = Math.floor((this.ROWS - this.grid.length) / 2);
    const startCol = Math.floor((this.COLS - this.grid[0].length) / 2);
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid[i].length; j++) {
      expandedArray[startRow + i][startCol + j] = this.grid[i][j];
    }
  }
     this.grid = expandedArray;
  }
  }

  trackByRow(index: number, row: any): number {
    return index; 
  }

  trackByCol(index: number, col: any): number {
    return index; 
  }
}
