import Post from '../models/Post.js';

export async function createPost(req, res) {
  try {
    const { text, imageId } = req.body;

    const post = await Post.create({
      author: req.user._id,
      text,
      image: imageId || null,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: `createPost: ${error.message}` });
  }
}

export async function getFeed(req, res) {
  try {
    const posts = await Post.find()
      .populate('author', 'email')
      .populate('comments.user', 'email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// eslint-disable-next-line consistent-return
export async function toggleLike(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'toggleLike: post not found' });
    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ error: `toggleLike: ${error.message}` });
  }
}

// eslint-disable-next-line consistent-return
export async function addComment(req, res) {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'addComment: Post not found' });
    post.comments.push({
      user: req.user._id,
      text,
    });
    await post.save();
    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ error: `addComment: ${error.message}` });
  }
}
