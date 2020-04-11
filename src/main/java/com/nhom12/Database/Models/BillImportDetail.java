/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.nhom12.Database.Models;

import javax.persistence.*;

/**
 *
 * @author ThongPVT
 */
@Entity
@Table(name = "chitietPN")
public class BillImportDetail {

    @EmbeddedId
    BillImportProductKey id;
//    @Id
//    private int MaPN;
//    @Id
//    private int MaSP;
    private int SoLuong;
    private Double Gia;
    private int MaSize;
    private int MaMau;
    private Double ThanhTien;

    
    @ManyToOne
    @MapsId("MaPN")
    @JoinColumn(name = "MaPN")
    BillImport billImport;
 
    @ManyToOne
    @MapsId("MaSP")
    @JoinColumn(name = "MaSP")
    Product product;

    @ManyToOne
    @JoinColumn(name = "MaSize")
    private Size size;

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    @ManyToOne
    @JoinColumn(name = "MaMau")
    private Color color;

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }
}
