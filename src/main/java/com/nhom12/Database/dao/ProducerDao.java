/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.nhom12.Database.dao;

import com.nhom12.Database.HibernateUtil;
import com.nhom12.Database.Models.Customer;
import com.nhom12.Database.Models.Producer;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;

/**
 *
 * @author ThongPVT
 */
public class ProducerDao {
    
    private SessionFactory factory;
    private Session session;

    public ProducerDao() {
        factory = HibernateUtil.getSessionFactory();
    }
    
    //Lấy danh sách nsx
    public List<Producer> getProducers() {
        List<Producer> producers = new ArrayList<>();
        session = factory.getCurrentSession();
        try {

            session.getTransaction().begin();
            String hql = "from Producer";
            Query query = session.createQuery(hql);
            
            producers = (List<Producer>) query.list();
            session.getTransaction().commit();

        } catch (Exception ex) {
            session.getTransaction().rollback();
            throw ex;

        }
        session.close();
        return producers;
    }
    
    
    public Producer getProducerById(int id) {
        Producer result = null;
        session = factory.getCurrentSession();

        try {

            session.getTransaction().begin();
            String hql = "select c from Producer c where c.mansx=:uid";
            Query query = session.createQuery(hql);
            query.setParameter("uid", id);
            result = (Producer) query.uniqueResult();
            session.getTransaction().commit();

        } catch (HibernateException ex) {
            ex.printStackTrace();
            session.getTransaction().rollback();
        }
        session.close();
        return result;
    }
    
}
