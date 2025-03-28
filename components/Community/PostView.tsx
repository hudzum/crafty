import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Image 
} from 'react-native';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  increment 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../FirebaseConfig';
interface PostProps {
  id: string;
  description: string;
  username: string;
  materials: string[];
  likes: number;
  comments: string[];
  imageUrl?: string;
  imagePath?: string;
}

const PostView: React.FC<PostProps> = ({
  id,
  description,
  username,
  materials,
  likes,
  comments,
  imageUrl,
  imagePath
}) => {
  const [newComment, setNewComment] = useState('');
  const [localLikes, setLocalLikes] = useState(likes);
  const [localComments, setLocalComments] = useState(comments);

  const auth = getAuth();

  const handleLike = async () => {
    try {
      // Ensure user is logged in
      if (!auth.currentUser) {
        alert('Please log in to like a post');
        return;
      }

      const postRef = doc(db, 'posts', id);
      
      // Optimistically update UI
      setLocalLikes(prev => prev + 1);

      // Update Firestore
      await updateDoc(postRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert optimistic update if error occurs
      setLocalLikes(likes);
      alert('Failed to like post');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // Ensure user is logged in
      if (!auth.currentUser) {
        alert('Please log in to comment');
        return;
      }

      const postRef = doc(db, 'posts', id);
      
      const commentToAdd = `${auth.currentUser.displayName || 'Anonymous'}: ${newComment.trim()}`;

      // Optimistically update UI
      setLocalComments(prev => [...prev, commentToAdd]);
      setNewComment('');

      // Update Firestore
      await updateDoc(postRef, {
        comments: arrayUnion(commentToAdd)
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      // Revert optimistic update if error occurs
      setLocalComments(comments);
      alert('Failed to add comment');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.username}>{username}</Text>
        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
          <Text style={styles.likeText}>❤️ {localLikes}</Text>
        </TouchableOpacity>
      </View>

      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.postImage} 
          resizeMode="cover"
        />
      )}

      <Text style={styles.description}>{description}</Text>

      <View style={styles.materialsContainer}>
        <Text style={styles.materialsTitle}>Materials:</Text>
        {materials.map((material, index) => (
          <Text key={index} style={styles.materialItem}>
            • {material}
          </Text>
        ))}
      </View>

      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>Comments:</Text>
        <ScrollView>
          {localComments.map((comment, index) => (
            <Text key={index} style={styles.commentItem}>
              {comment}
            </Text>
          ))}
        </ScrollView>
      </View>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity 
          onPress={handleAddComment} 
          style={styles.sendCommentButton}
        >
          <Text style={styles.sendCommentButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  materialsContainer: {
    marginBottom: 10,
  },
  materialsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  materialItem: {
    marginLeft: 10,
    color: '#555',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    marginLeft: 5,
  },
  commentsContainer: {
    maxHeight: 150,
    marginBottom: 10,
  },
  commentsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentItem: {
    marginBottom: 5,
    color: '#555',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendCommentButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendCommentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PostView;