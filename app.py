from flask import Flask, request, jsonify, session # type: ignore
from flask_sqlalchemy import SQLAlchemy # type: ignore
from datetime import datetime,timedelta
import bcrypt # type: ignore
from flask_wtf import FlaskForm # type: ignore
from wtforms import StringField, PasswordField, SubmitField, ValidationError # type: ignore
from wtforms.validators import DataRequired, Email # type: ignore
from flask_cors import CORS   # type: ignore
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
from bson.objectid import ObjectId  # Ensure this import is present

app = Flask(__name__)
CORS(app,supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:anvit@localhost/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['JWT_SECRET_KEY'] = '8308371366'  # Change this to a random secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config["MONGO_URI"] = "mongodb://localhost:27017/Mydatabase"
mongo = PyMongo(app)
jwt = JWTManager(app)
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'TT_Users'
    UserID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Fullname = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(255), unique=True, nullable=False)
    Password = db.Column(db.String(200), nullable=False)
    Mobileno = db.Column(db.String(15))
    Role = db.Column(db.String(255))
    JoinDate = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    def __repr__(self):
        return f"User('{self.Fullname}', '{self.Email}')"

class Questions(db.Model):
    __tablename__ = 'TT_Questions'
    QuestionID = db.Column('QuestionID',db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column('UserID',db.Integer, db.ForeignKey('TT_Users.UserID'), nullable=False)
    Question = db.Column('Question',db.String(500), nullable=False)
    Que_prefix = db.Column('Que_prefix',db.String(100), nullable=False)
    Prog_topic = db.Column('Prog_topic',db.String(100), nullable=False)
    Prog_tech = db.Column('Prog_tech',db.String(100), nullable=False)
    Prog_lang = db.Column('Prog_lang',db.String(100), nullable=False)
    CreationDate = db.Column('CreationDate',db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'QuestionID': self.QuestionID,
            'UserID': self.UserID,
            'Question': self.Question,
            'Que_prefix': self.Que_prefix,
            'Prog_topic': self.Prog_topic,
            'Prog_tech': self.Prog_tech,
            'Prog_lang': self.Prog_lang,
            'CreationDate': self.CreationDate.isoformat() if self.CreationDate else None
        }

class Answer(db.Model):
    __tablename__ = 'TT_Answers'
    AnswerID = db.Column('AnswerID',db.Integer, primary_key=True, autoincrement=True)
    QuestionID = db.Column('QuestionID',db.Integer, db.ForeignKey('TT_Questions.QuestionID'), nullable=False)
    UserID = db.Column('UserID',db.Integer, db.ForeignKey('TT_Users.UserID'), nullable=False)
    Answer = db.Column('Answer',db.Text, nullable=False)
    CreationDate = db.Column('CreationDate',db.TIMESTAMP, server_default=db.func.current_timestamp())
    Ans_type = db.Column('Ans_type',db.Integer)

    def to_dict(self):
        return {
            'AnswerID': self.AnswerID,
            'QuestionID': self.QuestionID,
            'UserID': self.UserID,
            'Answer': self.Answer,
            'CreationDate': self.CreationDate.isoformat() if self.CreationDate else None,
            'Ans_type': self.Ans_type
        }

class Comment(db.Model):
    __tablename__ = 'TT_Comments'
    CommentID = db.Column('CommentID', db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column('UserID', db.Integer, db.ForeignKey('TT_Users.UserID'), nullable=False)
    AnswerID = db.Column('AnswerID', db.Integer, db.ForeignKey('TT_Answers.AnswerID'), nullable=False)
    Comment = db.Column('Comment', db.Text, nullable=False)
    CreationDate = db.Column('CreationDate', db.TIMESTAMP, server_default=db.func.current_timestamp())

    def to_dict(self):
        return {
            'CommentID': self.CommentID,
            'UserID': self.UserID,
            'AnswerID': self.AnswerID,
            'Comment': self.Comment,
            'CreationDate': self.CreationDate.isoformat() if self.CreationDate else None
        }

class Encyclopedia(db.Model):
    __tablename__ = 'TT_Encyclopedia'
    EncyclopediaID = db.Column('EncyclopediaID',db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column('UserID',db.Integer, db.ForeignKey('TT_Users.UserID'))
    QuestionID = db.Column('QuestionID',db.Integer, db.ForeignKey('TT_Questions.QuestionID'))
    AnswerID = db.Column('AnswerID',db.Integer, db.ForeignKey('TT_Answers.AnswerID'))
    CommentID = db.Column('CommentID',db.Integer, db.ForeignKey('TT_Comments.CommentID'))
    CreationDate = db.Column('CreationDate',db.TIMESTAMP, server_default=db.func.current_timestamp())

    def to_dict(self):
        return {
            'EncyclopediaID': self.EncyclopediaID,
            'UserID': self.UserID,
            'QuestionID': self.QuestionID,
            'AnswerID': self.AnswerID,
            'CommentID': self.CommentID,
            'CreationDate': self.CreationDate.isoformat() if self.CreationDate else None
        }

@db.event.listens_for(Questions, 'after_insert')
def after_question_insert(mapper, connection, target):
    entry = Encyclopedia(UserID=target.UserID, QuestionID=target.QuestionID)
    connection.execute(Encyclopedia.__table__.insert().values(entry.to_dict()))

@db.event.listens_for(Answer, 'after_insert')
def after_answer_insert(mapper, connection, target):
    entry = Encyclopedia(UserID=target.UserID, AnswerID=target.AnswerID)
    connection.execute(Encyclopedia.__table__.insert().values(entry.to_dict()))

@db.event.listens_for(Comment, 'after_insert')
def after_comment_insert(mapper, connection, target):
    entry = Encyclopedia(UserID=target.UserID, AnswerID=target.AnswerID, CommentID=target.CommentID)
    connection.execute(Encyclopedia.__table__.insert().values(entry.to_dict()))

class RegistrationForm(FlaskForm):
    Fullname = StringField('Fullname', validators=[DataRequired()])
    Email = StringField('Email', validators=[DataRequired(), Email()])
    Password = PasswordField('Password', validators=[DataRequired()])
    Mobileno = StringField('Mobile Number')
    Role = StringField('Role')
    submit = SubmitField('Register')

    def validate_Email(self, Email):
        user = User.query.filter_by(Email=Email.data).first()
        if user:
            raise ValidationError('Email is already registered. Please choose a different one.')

class LoginForm(FlaskForm):
    Email = StringField('Email', validators=[DataRequired(), Email()])
    Password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'Fullname' not in data or 'Email' not in data or 'Password' not in data:
        return jsonify({'error': 'Bad Request', 'message': 'Missing required fields'}), 400
    
    Fullname = data['Fullname']
    Email = data['Email']
    Password = data['Password']
    Mobileno = data.get('Mobileno')
    Role = data.get('Role', 'User')  # Default role is User

    existing_user = User.query.filter_by(Email=Email).first()
    if existing_user:
        return jsonify({'error': 'Conflict', 'message': 'Email already registered'}), 409

    hashed_Password = bcrypt.hashpw(Password.encode('utf-8'), bcrypt.gensalt())
    new_user = User(Fullname=Fullname, Email=Email, Password=hashed_Password.decode('utf-8'), Mobileno=Mobileno, Role=Role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 200

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    Email = data.get('Email')
    Password = data.get('Password')

    user = User.query.filter_by(Email=Email).first()

    if user and bcrypt.checkpw(Password.encode('utf-8'), user.Password.encode('utf-8')):
        access_token = create_access_token(identity=user.UserID)
        return jsonify({'message': 'Login successful', 'token': access_token, 'user': {'Fullname': user.Fullname, 'Email': user.Email}})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# @app.route('/auth/user', methods=['GET'])
# @jwt_required()
# def get_user():
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)
    
#     if not user:
#         return jsonify({'error': 'Not Found', 'message': 'User not found'}), 404
    
#     user_data = {
#         'Fullname': user.Fullname,
#         'Email': user.Email,
#         'Mobileno': user.Mobileno,
#         'Role': user.Role,
#         'JoinDate': user.JoinDate.isoformat()
#     }
#     return jsonify(user_data), 200

@app.route('/auth/user', methods=['GET'])
@jwt_required()
def get_authenticated_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'UserID': user.UserID,
            'Fullname': user.Fullname,
            'Email': user.Email,
            'Mobileno': user.Mobileno,
            'Role': user.Role,
            'JoinDate': user.JoinDate.isoformat() if user.JoinDate else None
        }), 200
    return jsonify({"error": "User not found"}), 404


@app.route('/auth/logout', methods=['POST'])
def logout():
    session.pop('UserID', None)
    session.pop('Fullname', None)
    return jsonify({'message': 'Logged out'}), 200

@app.route('/questions', methods=['GET'])
def get_questions():
    questions = Questions.query.all()
    return jsonify([q.to_dict() for q in questions])

# @app.route('/questions', methods=['POST'])
# @jwt_required()
# def create_question():
#     try:
#         data = request.get_json()
#         user_id = data['UserID']
#         question = data['Question']
#         que_prefix = data['Que_prefix']
#         prog_topic = data['Prog_topic']
#         prog_tech = data['Prog_tech']
#         prog_lang = data['Prog_lang']

#         new_question = Questions(
#             UserID=user_id,
#             Question=question,
#             Que_prefix=que_prefix,
#             Prog_topic=prog_topic,
#             Prog_tech=prog_tech,
#             Prog_lang=prog_lang
#         )

#         db.session.add(new_question)
#         db.session.commit()

#         response = new_question.to_dict()
#         return jsonify(response), 201

#     except Exception as e:
#         db.session.rollback()
#         app.logger.error(f"Error creating question: {str(e)}")
#         return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

@app.route('/post-question', methods=['POST'])
@jwt_required()
def post_question():
    user_id = get_jwt_identity()
    data = request.get_json()
    question = Questions(
        UserID=user_id,
        Question=data['Question'],
        Que_prefix=data['Que_prefix'],
        Prog_topic=data['Prog_topic'],
        Prog_tech=data['Prog_tech'],
        Prog_lang=data['Prog_lang']
    )
    db.session.add(question)
    db.session.commit()
    return jsonify({'message': 'Question posted successfully'}), 201

# questions = {
#     1: {"QuestionID": 1, "Question": "What is React?"},
#     18: {"QuestionID": 18, "Question": "How to use Flask with React?"}
# }

@app.route('/questions/<int:questionID>', methods=['GET'])
def get_question(questionID):
    try:
        question = Questions.query.get(questionID)
        if question:
            answers = Answer.query.filter_by(QuestionID=questionID).all()
            answers_list = [{'AnswerID': ans.AnswerID, 'UserID': ans.UserID, 'Answer': ans.Answer, 'CreationDate': ans.CreationDate} for ans in answers]
            return jsonify({'Question': question.Question, 'Answers': answers_list}), 200
        return jsonify({'message': 'Question not found'}), 404
    except Exception as e:
        print(f"Error fetching question and answers: {e}")
        return jsonify({'message': 'Internal Server Error'}), 500

@app.route('/questions/<int:question_id>/answers', methods=['GET'])
def get_answers(question_id):
    answers = Answer.query.filter_by(QuestionID=question_id).all()
    return jsonify([answer.to_dict() for answer in answers])


# @app.route('/answer-question', methods=['POST'])
# @jwt_required()
# def answer_question():
#     data = request.json
#     new_answer = Answer(
#         QuestionID=data['QuestionID'],
#         UserID=data['UserID'],
#         Answer=data['Answer']
#     )
#     db.session.add(new_answer)
#     db.session.commit()
#     return jsonify({'message': 'Answer submitted successfully'}), 201

@app.route('/answer-question', methods=['POST'])
@jwt_required()
def answer_question():
    user_id = get_jwt_identity()
    data = request.get_json()
    answer = Answer(
        QuestionID=data['QuestionID'],
        UserID=user_id,
        Answer=data['Answer']
    )
    db.session.add(answer)
    db.session.commit()
    return jsonify({'message': 'Answer submitted successfully'}), 201

# @app.route('/answers/<int:answer_id>/comments', methods=['POST'])
# @jwt_required()
# def add_comment(answer_id):
#     user_id = get_jwt_identity()  # Get the user ID from the JWT token
#     data = request.json
#     comment_text = data.get('comment')

#     new_comment = Comment(
#         UserID=user_id,
#         AnswerID=answer_id,
#         Comment=data['Comment']
#     )
#     try:
#         db.session.add(new_comment)
#         db.session.commit()
#         return jsonify({'id': new_comment.CommentID}), 201
#     except SQLAlchemyError as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500

# @app.route('/answers/<int:answer_id>/comments', methods=['GET'])
# @jwt_required()
# def get_comments(answer_id):
#     comments = Comment.query.filter_by(AnswerID=answer_id).all()
#     comments_list = [comment.to_dict() for comment in comments]
#     return jsonify(comments_list), 200

@app.route('/answers/<int:answer_id>/comments', methods=['POST'])
@jwt_required()
def submit_comment(answer_id):
    user_id = get_jwt_identity()
    data = request.json
    comment_text = data.get('comment')
    
    new_comment = Comment(
        UserID=user_id,
        AnswerID=answer_id,
        Comment=comment_text
    )
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify({"message": "Comment added successfully"}), 201

@app.route('/answers/<int:answer_id>/comments', methods=['GET'])
def get_comments(answer_id):
    comments = Comment.query.filter_by(AnswerID=answer_id).all()
    comment_list = [comment.to_dict() for comment in comments]
    return jsonify(comment_list), 200


@app.route('/profile', methods=['POST'])
def create_profile():
    data = request.json
    profile_id = mongo.db.profiles.insert_one(data).inserted_id
    return jsonify(str(profile_id)), 201

@app.route('/profile/<id>', methods=['GET'])
def get_profile(id):
    try:
        profile = mongo.db.profiles.find_one_or_404({'_id': ObjectId(id)})
        profile['_id'] = str(profile['_id'])
        return jsonify(profile)
    except errors.InvalidId:
        return jsonify({"error": "Invalid profile ID"}), 400    
    
if __name__ == '__main__':
    app.run(debug=True)

