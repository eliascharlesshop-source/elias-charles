# Inland Empire Box Model Overview

## Executive Summary

The Inland Empire (IE) Box Model represents a strategic shift from individual product sales to curated, themed collections. This model is designed to increase Average Order Value (AOV), simplify customer decisions, and create a collectible experience around seasonal moments.

## Key Benefits

- **Increased AOV**: Box configurations naturally raise cart values through bundling
- **Decision Simplification**: Customers choose from 4 core options instead of individual items
- **Collectible Appeal**: Seasonal themes create urgency and repeat purchases
- **Margin Protection**: 65%+ gross margin built into each box configuration
- **Inventory Efficiency**: Better demand forecasting through curated bundles

## Box Configuration

### Core Boxes (Always Available)

1. **IE Starter Box** - $59-69
   - Target: Entry-level customers, gift purchases
   - Contents: White Tee + Socks + Sticker Card
   - Margin: 68%
   - Launch: Week 1

2. **IE Street Box** - $119-139
   - Target: Core bestseller, everyday wear
   - Contents: Graphic Tee + Fitted Hat + Athleisure Shorts
   - Margin: 67%
   - Launch: Week 1

3. **IE Layered Box** - $179-219
   - Target: Premium streetwear enthusiasts
   - Contents: Graphic Hoodie + Jeans + Socks
   - Margin: 66%
   - Launch: Week 2

### Limited Edition

4. **IE Diamond Box** - $249-299
   - Target: Collectors, high-value customers
   - Contents: Jacket + Button Down + Chino Shorts + Hat
   - Margin: 65%
   - Launch: Week 3 (Limited quantities)

### Add-On

- **IE Footwork Add-On** - +$75-120
   - Footwear upsell at checkout
   - Limited to one option to maintain conversion

## Launch Strategy

### Week-Based Rollout

- **Week 1**: IE Starter + IE Street (Volume + Social Proof)
- **Week 2**: IE Layered (AOV Push)
- **Week 3**: IE Diamond Limited (Scarcity + Creator Story)

### Seasonal Themes

Boxes are themed around upcoming moments:
- Easter (Spring colors, renewal theme)
- Mother's Day (Gift-oriented, premium packaging)
- Memorial Day (Patriotic, outdoor lifestyle)
- Father's Day (Utilitarian, durable goods)
- Independence Day (Celebratory, limited edition)

## Inventory Architecture

### Tier-Based SKU Focus

| Tier | SKU Focus | Role | Buy Share | Price Band |
|------|------------|------|-----------|------------|
| Hero | Graphic Tees, White Tees, Hoodies, Hats, Jeans | Traffic + Conversion | 45% | $38-110 |
| Profit | Jackets, Button Downs, Chino Shorts, Athleisure | Margin + AOV | 40% | $58-160 |
| Culture | Baseball Shirts, Socks, Footwear | Brand Depth | 15% | $14-180 |

### Guardrails

- **Reorder Trigger**: Hero SKUs >25% sell-through in Week 1
- **Markdown Risk**: Culture SKUs <10% sell-through by Day 21
- **CAC Limit**: Paid CAC <30% of AOV per bundle
- **Margin Check**: Don't scale ads if margin compression occurs

## Subscription Model

### Plans Available

1. **IE Starter Subscription** - $59/month
   - Single box rotation
   - 15% discount
   - Monthly delivery

2. **IE Street Subscription** - $119/month
   - Core box focus
   - 15% discount
   - Monthly delivery

3. **IE Complete Subscription** - $179/quarter
   - Full box rotation
   - 20% discount
   - Quarterly delivery

### Benefits

- Predictable revenue stream
- Higher customer lifetime value
- Better inventory planning
- Exclusive subscriber perks

## Technology Implementation

### Frontend Components

- `BoxCard`: Individual box display with pricing and CTA
- `BoxShowcase`: Complete collection presentation
- `SubscriptionPlans`: Plan comparison and selection
- `SubscriptionProvider`: State management for subscriptions

### Data Structure

- Box configurations stored in `data/box-config.ts`
- TypeScript interfaces in `types/box-model.ts`
- Subscription state managed via React Context

### Integration Points

- Shopify for inventory and checkout
- LocalStorage for subscription persistence
- Email service for delivery notifications

## Success Metrics

### Primary KPIs

- **AOV Increase**: Target 40% lift over individual product sales
- **Conversion Rate**: Maintain >3% on box pages
- **Subscription Rate**: 15% of first-time box buyers
- **Customer Retention**: 70%+ monthly subscription retention

### Secondary Metrics

- **Sell-through Rate**: 80%+ within 30 days
- **Margin Achievement**: 65%+ average across all boxes
- **Customer Satisfaction**: 4.5+ star rating
- **Social Proof**: 500+ user-generated content pieces per launch

## Next Steps

1. **Finalize COGS**: Lock in supplier pricing for all box components
2. **Photography**: Professional box content and lifestyle shots
3. **Marketing Assets**: Email templates, social media creative
4. **Inventory Planning**: Place initial orders based on forecast
5. **Testing**: A/B test box configurations and pricing
6. **Launch**: Execute week-based rollout strategy

## Risk Mitigation

- **Demand Fragmentation**: Limit to 3 core + 1 limited box
- **Inventory Risk**: Conservative buy on Culture tier SKUs
- **Margin Compression**: Pre-negotiate volume discounts
- **Customer Confusion**: Clear positioning and educational content

---

*This document serves as the strategic foundation for the IE Box Model implementation. All tactical decisions should reference these core principles.*
