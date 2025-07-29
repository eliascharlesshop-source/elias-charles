# 🚀 EC Store - Production Deployment Checklist

## ✅ **Pre-Deployment Checklist**

### 🔧 **Local Testing**
- [ ] Run `npm run build` successfully
- [ ] Run `npm run start` and test locally  
- [ ] Run `./scripts.sh test-shopify` - all tests pass
- [ ] Run `./scripts.sh verify` - comprehensive check passes
- [ ] Test all key pages: home, collections, products, cart
- [ ] Test mobile responsiveness
- [ ] Verify Shopify integration working with live data

### 📝 **Environment Configuration**
- [ ] `.env.local` contains all required variables
- [ ] Production environment variables configured on hosting platform:
  - [ ] `SHOPIFY_STORE_DOMAIN=eliascharles-shop.myshopify.com`
  - [ ] `SHOPIFY_STOREFRONT_ACCESS_TOKEN=e022fd0d...`
  - [ ] `SHOPIFY_API_VERSION=2024-01`
  - [ ] `NEXT_PUBLIC_USE_SHOPIFY=true`
  - [ ] `NEXT_PUBLIC_SITE_URL=https://eliascharles.com`
  - [ ] `NEXTAUTH_SECRET=your-secret-key`
  - [ ] `NEXTAUTH_URL=https://eliascharles.com`

### 🏗️ **Build Configuration**
- [ ] `next.config.mjs` optimized for production
- [ ] Image optimization configured
- [ ] Security headers enabled
- [ ] CORS settings appropriate

## 🌐 **Deployment Steps**

### **Option 1: Vercel (Recommended)**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod

# 4. Configure domain in Vercel dashboard
# 5. Add environment variables in Vercel dashboard
```

### **Option 2: Netlify**
```bash
# 1. Build the project
npm run build

# 2. Deploy via Netlify CLI or dashboard
netlify deploy --prod --dir=.next

# 3. Configure domain in Netlify dashboard
# 4. Add environment variables in Netlify dashboard
```

### **Option 3: Custom Server**
```bash
# 1. Build the project
npm run build

# 2. Copy files to server
# 3. Install dependencies on server
# 4. Configure environment variables
# 5. Start with PM2 or similar: npm run start
```

## 🌍 **Domain Configuration**

### **DNS Settings (Update at your domain registrar)**

For **Vercel**:
```
Type: A     Name: @        Value: 76.76.19.61
Type: CNAME Name: www      Value: cname.vercel-dns.com
Type: CNAME Name: *        Value: cname.vercel-dns.com
```

For **Netlify**:
```
Type: A     Name: @        Value: 75.2.60.5
Type: CNAME Name: www      Value: your-site-name.netlify.app
```

For **Custom Server**:
```
Type: A     Name: @        Value: YOUR_SERVER_IP
Type: CNAME Name: www      Value: eliascharles.com
```

### **Domain Verification**
- [ ] DNS propagation complete (24-48 hours)
- [ ] SSL certificate auto-generated and active
- [ ] Both `eliascharles.com` and `www.eliascharles.com` work
- [ ] HTTP redirects to HTTPS automatically

## 🧪 **Post-Deployment Testing**

### **Automated Testing**
```bash
# Test production deployment
./scripts.sh verify-production

# Set custom domain for testing
PRODUCTION_DOMAIN=eliascharles.com ./scripts.sh verify-production
```

### **Manual Testing**
- [ ] Homepage loads correctly
- [ ] Products display from Shopify
- [ ] Collections work properly
- [ ] Product pages load individual items
- [ ] Add to cart functionality works
- [ ] Cart updates properly
- [ ] Checkout redirects to Shopify
- [ ] Mobile layout responsive
- [ ] Page load speed acceptable (< 3 seconds)
- [ ] All images load properly
- [ ] Navigation works on all devices

### **Shopify Integration Testing**
- [ ] Products sync with Shopify inventory
- [ ] Price updates reflect immediately
- [ ] Product availability accurate
- [ ] Collections update automatically
- [ ] Checkout process completes successfully
- [ ] Orders appear in Shopify admin
- [ ] Inventory decreases after purchase

## 📊 **Performance & SEO**

### **Performance**
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals optimized
- [ ] Images optimized and responsive
- [ ] CSS and JS minified
- [ ] Caching headers configured

### **SEO**
- [ ] Meta tags configured
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Open Graph tags for social sharing
- [ ] Google Analytics installed (optional)

## 🔒 **Security**

- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] API keys not exposed in frontend
- [ ] Content Security Policy configured
- [ ] XSS protection enabled

## 📈 **Monitoring & Analytics**

### **Setup Monitoring**
- [ ] Google Analytics (if desired)
- [ ] Vercel/Netlify analytics
- [ ] Shopify analytics
- [ ] Error tracking (Sentry recommended)
- [ ] Uptime monitoring

### **Performance Monitoring**
- [ ] Page load speed tracking
- [ ] API response time monitoring
- [ ] Error rate monitoring
- [ ] Conversion tracking

## 🎯 **Go-Live Actions**

### **Final Steps**
- [ ] Update Shopify settings to point to new domain
- [ ] Test complete customer journey
- [ ] Inform stakeholders of new URL
- [ ] Update marketing materials
- [ ] Set up redirects from old domain (if applicable)

### **Launch Announcement**
- [ ] Social media announcement
- [ ] Email to existing customers
- [ ] Update business listings
- [ ] Submit to search engines

## 🚨 **Emergency Procedures**

### **If Something Goes Wrong**
1. **Rollback:** Revert to previous deployment
2. **DNS:** Switch back to old domain temporarily
3. **Contact Support:** Hosting platform support
4. **Monitor:** Check error logs and monitoring tools

### **Common Issues & Fixes**
- **DNS not resolving:** Check propagation, verify records
- **SSL issues:** Force SSL renewal, check certificate
- **API errors:** Verify environment variables
- **500 errors:** Check server logs, verify build
- **Slow loading:** Optimize images, check CDN

## ✅ **Success Criteria**

Your store is live and successful when:
- ✅ Domain resolves correctly
- ✅ SSL certificate active
- ✅ All pages load under 3 seconds
- ✅ Products display from Shopify
- ✅ Cart and checkout work
- ✅ Mobile responsive
- ✅ SEO optimized
- ✅ Analytics tracking
- ✅ Error monitoring active

## 🎉 **Congratulations!**

Once all items are checked, your EC Store is officially live at **https://eliascharles.com**!

Your customers can now:
- Browse your beautiful custom storefront
- View live products from your Shopify store
- Add items to cart through your optimized API
- Complete secure checkout through Shopify
- Enjoy a seamless shopping experience

---

**Need Help?** 
- 📖 See `docs/deployment/PRODUCTION_DEPLOYMENT.md` for detailed instructions
- 🧪 Run `./scripts.sh verify-production` to test your deployment
- 🛠️ Use `./scripts.sh help` for all available tools
