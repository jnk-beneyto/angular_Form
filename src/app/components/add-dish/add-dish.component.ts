import { Component,OnInit } from '@angular/core';
import { DishService } from 'src/app/services/dish.service';
import { Dish } from 'src/app/models/dish';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.css'],
  providers: [DishService]
})
export class AddDishComponent implements OnInit {

  public titleCreate: string;
  public titleList: string;
  public dish: Dish; 
  public ok: string;
  public dishes: [Dish];

  constructor(private _dishService: DishService, private toastr: ToastrService) {
    this.titleCreate = 'Create dish';
    this.titleList = 'Listing dishes';
    //this.dish = new Dish("", "", "", "");
  }

  showSuccess(message:string,type:string) {
    this.toastr.success(message, type);
  }
  showError(message:string,type:string){  
    this.toastr.error(message, type);  
  
}  

  ngOnInit(){
    this.resetForm();
    this.refreshDishList();
  }

  

  resetForm(form? : NgForm){
    if (form)
      form.reset();
      this._dishService.selectedDish = {
        _id:"",
        name:"",
        type:"",
        description:""
      }
  }

  onSubmit(form : NgForm) {
    if(form.value._id == "" || form.value._id == null){

      this._dishService.saveDish(form.value).subscribe(
        res => {
          if (res) {
            this.ok = 'yes';
            this.resetForm(form);
            this.refreshDishList();
            this.showSuccess('saved','success');
          } else {
            this.ok = 'no';
          }
        },
        err => {
          console.log(err);
        }
      );
    }else{
      this._dishService.updateDish(form.value).subscribe(
        res => {
          if (res) {
            this.ok = 'yes';
            this.showSuccess('updated','success');
            this.resetForm(form);
            this.refreshDishList();
          } else {
            this.ok = 'no';
          }
        },
        err => {
          console.log(err);
        }
      )
    }
  }

  getDishes() {
    this._dishService.getDishes().subscribe(
      //res => {dishes:res}
      res => {
        if (res) {
          console.log(res);
          this.dishes = res;
        }
      }

      ,
      err => {
        console.log(err);
      }
    );
  }

  deleteDish(dish : Dish, form : NgForm) {

    this._dishService.deleteDish(dish).subscribe(
      res => {
        if (res) {
          this.showSuccess('deleted','success');
          console.log('deleted id: ' + dish._id);
          this.resetForm(form);
          this.refreshDishList();
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  editDish(dish : Dish){
    this._dishService.selectedDish = dish;
  }

  refreshDishList(){
    this._dishService.getDishes().subscribe((res) =>{
      this._dishService.dishes = res as Dish[];
    })
  }
}
