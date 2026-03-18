const { db } = require('../config/firebase');

const addReview = async (req, res) => {
  const { pg_id, rating, comment } = req.body;
  const user_id = req.user.uid;

  if (!pg_id || !rating) {
    return res.status(400).json({ error: 'PG ID and rating are required' });
  }

  try {
    const reviewData = {
      user_id,
      pg_id,
      rating: Number(rating),
      comment: comment || '',
      created_at: new Date()
    };

    await db.collection('reviews').add(reviewData);

    // Optional: Update PG average rating (denormalization for performance)
    const pgRef = db.collection('pgs').doc(pg_id);
    const pgDoc = await pgRef.get();
    if (pgDoc.exists) {
      const currentData = pgDoc.data();
      const currentCount = currentData.review_count || 0;
      const currentAvg = currentData.avg_rating || 0;
      const newCount = currentCount + 1;
      const newAvg = ((currentAvg * currentCount) + Number(rating)) / newCount;
      
      await pgRef.update({
        avg_rating: newAvg,
        review_count: newCount
      });
    }

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

const getPGReviews = async (req, res) => {
  const { pgId } = req.params;
  try {
    const snapshot = await db.collection('reviews')
      .where('pg_id', '==', pgId)
      .orderBy('created_at', 'desc')
      .get();
    
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

module.exports = { addReview, getPGReviews };
