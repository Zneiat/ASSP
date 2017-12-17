<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAsspTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function ($table) {
            $table->increments('id');
            $table->string('email')->comment('邮箱');
            $table->string('password')->comment('密码');
            $table->string('portrait')->nullable()->comment('用户头像');
            $table->string('remember_token')->nullable()->comment('记住登陆状态的令牌');
            $table->boolean('is_admin')->default(false)->comment('是否管理员');
            $table->timestamp('signin_at')->nullable()->comment('最后登录时间');
            $table->timestamp('activated_at')->nullable()->comment('邮箱激活时间');
            $table->timestamps();
            $table->softDeletes();
            $table->comment = '用户表';
            $table->engine = 'MyISAM';
            $table->unique('email');
        });
    }
    
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
