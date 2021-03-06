/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.nhom12.Database.Models;

import java.util.List;

/**
 *
 * @author Truong98
 */
public class CartModel {
    private int productId;
    private String productName;
    private int quantity;
    private String urlImg;
    private double price;
    private int sizeId;
    private int sizeName;
    
    public int getProductId(){
        return productId;
    }
    public void setProductId(int id){
        productId = id;
    }
    
    public String getProductName(){
        return productName;
    }
    public void setProductName(String name){
        productName = name;
    }
    
    public int getQuantity(){
        return quantity;
    }
    public void setQuantity(int quant){
        quantity = quant;
    }
    
    public String getUrlImg(){
        return urlImg;
    }
    public void setUrlImg(String url){
        urlImg = url;
    }
    
    public double getPrice(){
        return price;
    }
    public void setPrice(double price){
        this.price = price;
    }
    
    public int getSizeId(){
        return sizeId;
    }
    public void setSizeId(int id){
        sizeId = id;
    }
    public int getSizeName(){
        return sizeName;
    }
    public void setSizeName(int name){
        sizeName = name;
    }
    
    public CartModel(){
        
    }
    
    public static int findIndex(List<CartModel> listCarts, int id, int sizeId){
          for(int i=0; i<listCarts.size(); i++){
            if(listCarts.get(i).getProductId() == id && listCarts.get(i).getSizeId() == sizeId){
                return i;
            }
        }
          return -1;
    }
    
}
