from flask import Blueprint, render_template
from ..models import GalleryAlbum, GalleryVideoAlbum

gallery_bp = Blueprint("gallery", __name__)

@gallery_bp.route('/gallery')
def gallery():
    albums = GalleryAlbum.query.all()
    video_albums = GalleryVideoAlbum.query.all()
    return render_template('gallery.html', albums=albums, video_albums=video_albums)